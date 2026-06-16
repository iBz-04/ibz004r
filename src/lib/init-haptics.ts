import { Haptics } from '@haptics/vanilla'

const interactiveSelector = [
  'a[href]',
  'button:not(:disabled)',
  '[role="button"]',
  '[role="link"]',
  'summary',
  '.cursor-pointer',
  '.ct-clickable',
  '.react-flow__controls-button',
].join(', ')

const toggleIds = new Set(['show-more-btn', 'show-less-btn'])

let haptics: Haptics | null = null
let reinitTimer: ReturnType<typeof setTimeout> | null = null

function shouldSkip(el: Element) {
  if (el.closest('[data-no-haptic]')) return true
  if (el.hasAttribute('data-haptic')) return true

  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement
  ) {
    return true
  }

  return false
}

function stamp(el: Element) {
  if (shouldSkip(el)) return
  el.setAttribute(
    'data-haptic',
    toggleIds.has(el.id) ? 'impact-medium' : 'selection',
  )
}

function scan(root: ParentNode = document) {
  if (root instanceof Element && root.matches(interactiveSelector)) {
    stamp(root)
  }

  root.querySelectorAll(interactiveSelector).forEach(stamp)
}

function setupHaptics() {
  scan()
  haptics?.destroy()
  haptics = new Haptics({
    audioFallback: import.meta.env.DEV,
  })
}

function scheduleSetup() {
  if (reinitTimer) clearTimeout(reinitTimer)
  reinitTimer = setTimeout(() => {
    reinitTimer = null
    setupHaptics()
  }, 50)
}

const stampObserver = new MutationObserver((mutations) => {
  let changed = false

  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (!(node instanceof Element)) continue

      if (node.matches(interactiveSelector)) {
        stamp(node)
        changed = true
      }

      node.querySelectorAll(interactiveSelector).forEach((el) => {
        stamp(el)
        changed = true
      })
    }
  }

  if (changed) scheduleSetup()
})

function start() {
  setupHaptics()
  stampObserver.observe(document.body, { childList: true, subtree: true })
  document.addEventListener('astro:page-load', scheduleSetup)
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true })
  } else {
    start()
  }
}
