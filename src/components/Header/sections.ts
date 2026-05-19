export type SectionId = 'hero' | 'about' | 'skills' | 'projects'

export type Section = {
  id: SectionId
  label: string
}

export const SECTIONS: readonly Section[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
] as const
