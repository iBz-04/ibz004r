import { WebHaptics, type HapticInput } from 'web-haptics'

let haptics: WebHaptics | null = null

export function triggerHaptic(input: HapticInput = 'selection') {
  if (!WebHaptics.isSupported) return

  if (!haptics) {
    haptics = new WebHaptics()
  }

  haptics.trigger(input)
}
