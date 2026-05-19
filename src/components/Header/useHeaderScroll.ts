import { useEffect, useState } from 'react'

export function useHeaderScroll(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function update() {
      setScrolled(window.scrollY > threshold)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [threshold])

  return scrolled
}
