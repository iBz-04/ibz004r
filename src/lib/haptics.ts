import { WebHaptics, type HapticInput } from 'web-haptics'

let haptics: WebHaptics | null = null

function getHaptics() {
  if (!haptics) {
    haptics = new WebHaptics({
      debug: import.meta.env.DEV,
    })
  }

  return haptics
}

export function triggerHaptic(input: HapticInput = 'selection') {
  void getHaptics().trigger(input)
}

export function isHapticSupported() {
  return WebHaptics.isSupported
}
