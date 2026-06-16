import { Haptics } from '@haptics/vanilla'

const interactiveSelector = [
  'a[href]',
  'button:not(:disabled)',
  '[role="button"]',
  '[role="link"]',
  'summary',
  '.cursor-pointer',
  '.react-flow__controls-button',
].join(', ')

const excludedSelector = '.ct-canvas, .react-flow, [data-no-haptic]'

const toggleIds = new Set(['show-more-btn', 'show-less-btn'])

let haptics: Haptics | null = null

function shouldSkip(el: Element) {
  if (el.closest(excludedSelector)) return true
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

function start() {
  setupHaptics()
  document.addEventListener('astro:page-load', setupHaptics)
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true })
  } else {
    start()
  }
}
