import { type HapticInput, triggerHaptic } from './haptics'

const interactiveSelector = [
  'a[href]',
  'button:not(:disabled)',
  '[role="button"]',
  '[role="link"]',
  'summary',
  'label[for]',
  '.cursor-pointer',
  '.ct-clickable',
  '.react-flow__controls-button',
  '[data-haptic]',
].join(', ')

const toggleIds = new Set(['show-more-btn', 'show-less-btn'])

let lastKey = ''
let lastAt = 0

function getPattern(el: Element): HapticInput {
  const custom = el.getAttribute('data-haptic')
  if (custom) return custom as HapticInput
  if (toggleIds.has(el.id)) return 'nudge'
  return 'selection'
}

function shouldSkip(el: Element) {
  if (el.closest('[data-no-haptic]')) return true

  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement
  ) {
    return true
  }

  return false
}

function handleInteraction(event: Event) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const target = event.target
  if (!(target instanceof Element)) return

  const el = target.closest(interactiveSelector)
  if (!el || shouldSkip(el)) return

  if (event.type === 'pointerup') {
    const pointerEvent = event as PointerEvent
    if (pointerEvent.button !== 0) return
  }

  const key = `${el.tagName}:${el.id}:${el.getAttribute('href') ?? el.className}`
  const now = Date.now()
  if (key === lastKey && now - lastAt < 400) return
  lastKey = key
  lastAt = now

  triggerHaptic(getPattern(el))
}

document.addEventListener('pointerup', handleInteraction, { passive: true })

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  handleInteraction(event)
})
