import React from "react"

type ColorScheme = 'light' | 'dark'

function useColorScheme() {
  const [scheme, setScheme] = React.useState<ColorScheme>('light')

  React.useEffect(() => {
    setScheme('light')
  }, [])

  return scheme
}

export { useColorScheme }