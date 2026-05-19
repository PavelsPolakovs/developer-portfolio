import { useEffect, useState } from 'react'
import type { SectionId } from './sections'

export function useActiveSection(ids: readonly SectionId[], offset = 96): SectionId {
  const [active, setActive] = useState<SectionId>(ids[0])

  useEffect(() => {
    function update() {
      let current: SectionId = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - offset <= 0) {
          current = id
        }
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids, offset])

  return active
}
