---
title: 'Building a tiny GPT in Rust'
description: 'Walkthrough with code: a character level GPT in Rust using Candle. Full repo on GitHub.'
pubDate: 2026-05-02
tags:
  - rust
  - machine learning
  - gpt
  - candle
  - transformers
---

If you only call an API, the model is a black box. This project is the opposite: one file of Rust, [Candle](https://github.com/huggingface/candle) for tensors, and the ideas from [*Attention Is All You Need*](https://arxiv.org/abs/1706.03762) boiled down to a **decoder only** stack (masked self attention, no encoder). That is the same family as GPT: predict the next character given everything so far.

Everything lives in [RustGPT on GitHub](https://github.com/iBz-04/RustGPT). This post sticks to plain language and shows the parts that matter in code.

## What you need at the top of the file

Errors use `anyhow`. Training uses `candle_core`, `candle_nn`, and `rand` for batch sampling and generation.

```rust
use anyhow::{bail, Context, Result};
use candle_core::{DType, Device, Tensor, D};
use candle_nn as nn;
use candle_nn::{Module, Optimizer};
use rand::distributions::{Distribution, WeightedIndex};
use rand::{Rng, SeedableRng};
use std::collections::HashMap;
use std::fs;
```

## Knobs in one place

All sizes and training settings sit in `Config`. `vocab_size` is filled in after you read the text because it depends on how many unique characters you have.

```rust
#[derive(Clone)]
struct Config {
    batch_size: usize,
    block_size: usize,
    max_iters: usize,
    eval_interval: usize,
    eval_iters: usize,
    learning_rate: f64,
    n_embd: usize,
    n_head: usize,
    n_layer: usize,
    dropout: f64,
    seed: u64,
    max_new_tokens: usize,
    vocab_size: usize,
    temperature: f32,
    top_k: usize,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            batch_size: 32,
            block_size: 256,
            max_iters: 8000,
            eval_interval: 1000,
            eval_iters: 100,
            learning_rate: 3e-4,
            n_embd: 192,
            n_head: 6,
            n_layer: 4,
            dropout: 0.1,
            seed: 1337,
            max_new_tokens: 500,
            vocab_size: 0,
            temperature: 0.9,
            top_k: 40,
        }
    }
}
```

## Turn `input.txt` into numbers

We keep it simple: **character level**. Build the alphabet from the file, sort and dedupe, map each character to a `u32`. The first 90% of tokens are train, the rest are validation.

```rust
struct Dataset {
    train: Vec<u32>,
    val: Vec<u32>,
    itos: Vec<char>,
}

fn build_dataset(path: &str) -> Result<Dataset> {
    let text = fs::read_to_string(path).with_context(|| format!("read {path}"))?;
    let mut vocab: Vec<char> = text.chars().collect();
    vocab.sort_unstable();
    vocab.dedup();

    let stoi: HashMap<char, u32> = vocab
        .iter()
        .enumerate()
        .map(|(i, ch)| (*ch, i as u32))
        .collect();
    let itos = vocab;

    let data = encode(&text, &stoi);
    let split = data.len() * 9 / 10;
    Ok(Dataset {
        train: data[..split].to_vec(),
        val: data[split..].to_vec(),
        itos,
    })
}

fn encode(text: &str, stoi: &HashMap<char, u32>) -> Vec<u32> {
    text.chars().map(|ch| stoi[&ch]).collect()
}

fn decode(tokens: &[u32], itos: &[char]) -> String {
    tokens.iter().map(|&i| itos[i as usize]).collect()
}
```

## Batches: predict the next character

For each random start index we take `block_size` tokens as `x`, and the same length shifted by one as `y`. So at every position the model should guess the **next** token. That is the whole training target.

```rust
#[derive(Clone, Copy)]
enum Split {
    Train,
    Val,
}

fn get_batch(
    split: Split,
    data: &Dataset,
    cfg: &Config,
    device: &Device,
    rng: &mut impl Rng,
) -> Result<(Tensor, Tensor)> {
    let source = match split {
        Split::Train => &data.train,
        Split::Val => &data.val,
    };
    if source.len() <= cfg.block_size + 1 {
        bail!("dataset too small for block_size")
    }

    let max_start = source.len() - cfg.block_size - 1;
    let mut x_buf = Vec::with_capacity(cfg.batch_size * cfg.block_size);
    let mut y_buf = Vec::with_capacity(cfg.batch_size * cfg.block_size);

    for _ in 0..cfg.batch_size {
        let start = rng.gen_range(0..max_start);
        x_buf.extend_from_slice(&source[start..start + cfg.block_size]);
        y_buf.extend_from_slice(&source[start + 1..start + 1 + cfg.block_size]);
    }

    let x = Tensor::from_vec(x_buf, (cfg.batch_size, cfg.block_size), device)?;
    let y = Tensor::from_vec(y_buf, (cfg.batch_size, cfg.block_size), device)?;
    Ok((x, y))
}
```

Loss is plain cross entropy on the flattened logits and integer labels.

```rust
fn compute_loss(logits: &Tensor, targets: &Tensor) -> Result<Tensor> {
    let (b, t, c) = logits.dims3()?;
    let logits = logits.reshape((b * t, c))?;
    let targets = targets.reshape((b * t,))?.to_dtype(DType::U32)?;
    Ok(nn::loss::cross_entropy(&logits, &targets)?)
}
```

## The causal mask (no peeking ahead)

Attention would let every position see the whole sentence. For language modeling we **must** hide the future. The mask is 1 where `i >= j` and 0 otherwise, so we keep lower triangular attention.

```rust
fn causal_mask(t: usize, device: &Device) -> Result<Tensor> {
    let idx = Tensor::arange(0u32, t as u32, device)?;
    let i = idx.reshape((t, 1))?.broadcast_as((t, t))?;
    let j = idx.reshape((1, t))?.broadcast_as((t, t))?;
    Ok(i.ge(&j)?.to_dtype(DType::U8)?)
}
```

## One attention layer (the heart of the paper)

Project input to `Q`, `K`, and `V`, split heads, scale the product of `Q` and `K` transposed, apply the mask and softmax, multiply by `V`, merge heads, project again. Dropout is on during training.

```rust
let k_t = k.transpose(2, 3)?;
let wei = (q.matmul(&k_t)? * self.scale)?;

let mask = causal_mask(t, x.device())?
    .unsqueeze(0)?
    .unsqueeze(0)?
    .broadcast_as((b, self.n_head, t, t))?;
let neg = Tensor::full(-1e4f32, (b, self.n_head, t, t), x.device())?;
let wei = mask.where_cond(&wei, &neg)?;

let wei = nn::ops::softmax(&wei, D::Minus1)?;
let wei = self.attn_dropout.forward(&wei, train)?;

let out = wei.matmul(&v)?;
```

## Block and full GPT forward

Each block is pre norm: layer norm, then attention, add residual. Then layer norm, feedforward (expand by 4x, GELU, project back), add residual. The GELU matches the usual GPT 2 style approximation.

```rust
fn forward_t(&self, x: &Tensor, train: bool) -> Result<Tensor> {
    let x = x.broadcast_add(&self.sa.forward_t(&self.ln1.forward(x)?, train)?)?;
    let x = x.broadcast_add(&self.ffwd.forward_t(&self.ln2.forward(&x)?, train)?)?;
    Ok(x)
}
```

The top level adds **token embeddings** plus **position embeddings**, runs `n_layer` blocks, final norm, then `lm_head` to logits over the vocabulary.

```rust
fn forward_t(&self, idx: &Tensor, train: bool) -> Result<Tensor> {
    let (_b, t) = idx.dims2()?;
    let tok_emb = self.token_embedding.forward(idx)?;
    let pos = Tensor::arange(0u32, t as u32, idx.device())?;
    let pos_emb = self.position_embedding.forward(&pos)?;
    let mut x = tok_emb.broadcast_add(&pos_emb)?;
    for block in &self.blocks {
        x = block.forward_t(&x, train)?;
    }
    let x = self.ln_f.forward(&x)?;
    Ok(self.lm_head.forward(&x)?)
}
```

## Training loop

Pick Metal on Apple Silicon if it works, else CPU. Build the `VarMap`, `AdamW`, loop `max_iters`, print train and val loss on a schedule, backward step each time.

```rust
let device = Device::new_metal(0).unwrap_or(Device::Cpu);
if matches!(device, Device::Metal(_)) {
    device.set_seed(cfg.seed)?;
}

let varmap = nn::VarMap::new();
let vb = nn::VarBuilder::from_varmap(&varmap, DType::F32, &device);
let model = GPT::new(&cfg, vb)?;

let mut opt = nn::AdamW::new(
    varmap.all_vars(),
    nn::ParamsAdamW {
        lr: cfg.learning_rate,
        ..Default::default()
    },
)?;

let mut rng = rand::rngs::StdRng::seed_from_u64(cfg.seed);

for iter in 0..cfg.max_iters {
    if iter % cfg.eval_interval == 0 || iter == cfg.max_iters - 1 {
        let (train, val) = estimate_loss(&model, &data, &cfg, &device, &mut rng)?;
        println!("step {iter}: train loss {train:.4}, val loss {val:.4}");
    }

    let (xb, yb) = get_batch(Split::Train, &data, &cfg, &device, &mut rng)?;
    let logits = model.forward_t(&xb, true)?;
    let loss = compute_loss(&logits, &yb)?;
    opt.backward_step(&loss)?;
}
```

## Generating text

We seed from a short slice of training data, then repeatedly take the last logits, divide by **temperature**, keep only **top k** candidates, softmax on CPU, sample one id, append, and feed the sliding window back in.

```rust
let mut logits = last.to_device(&Device::Cpu)?.to_vec1::<f32>()?;
let temp = cfg.temperature.max(1e-4);
for v in &mut logits {
    *v /= temp;
}
apply_top_k(&mut logits, cfg.top_k);
let probs = softmax_cpu(&logits);
let dist = WeightedIndex::new(&probs)?;
let next_id = dist.sample(rng) as u32;
idx.push(next_id);
```

## Saving weights

Weights are dumped as raw `f32` bytes plus a small JSON file listing shapes. Good enough to prove you can serialize what you trained. The loop that fills `tensors` walks `varmap.all_vars()`, copies each tensor to CPU, reshapes to a flat `f32` vector, and packs bytes (see the repo for the full `save_model`).

```rust
let metadata: Vec<(String, Vec<usize>)> = tensors
    .iter()
    .map(|(name, shape, _)| (name.clone(), shape.clone()))
    .collect();

let metadata_json = serde_json::to_string(&metadata)?;
fs::write(&format!("{}.meta.json", path), metadata_json)?;

let mut all_data = Vec::new();
for (_, _, bytes) in &tensors {
    all_data.extend_from_slice(bytes);
}
fs::write(path, &all_data)?;
```

The `.meta.json` file keeps the names and shapes so you could load the blob back if you write a loader.

## Closing

If you like learning by typing, this setup is small enough to read in an evening and real enough to watch loss go down. Clone [RustGPT](https://github.com/iBz-04/RustGPT), drop [TinyShakespeare](https://github.com/karpathy/char-rnn/blob/master/data/tinyshakespeare/input.txt) or any text into `input.txt`, and run `cargo run --release`. The architecture is the decoder side of the transformer from *Attention Is All You Need*. The rest is training and sampling.
