import { motion } from 'framer-motion'
import { ConstellationCanvas } from './ConstellationCanvas'
import { fadeInUp, staggerContainerDelayed } from '../../lib/animation-variants'

export function SkillsSection() {
  return (
    <motion.section
      id="skills"
      data-testid="skills-section"
      className="border-border border-t"
      variants={staggerContainerDelayed}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div className="mx-auto max-w-7xl px-6 pt-16" variants={fadeInUp}>
        <h2 className="text-fg text-3xl font-bold tracking-tight sm:text-4xl">Skills</h2>
        <p className="text-muted mt-2 text-sm">
          Click a star to explore — click outside to dismiss.
        </p>
      </motion.div>

      <motion.div
        className="mt-4 h-[560px] w-full sm:h-[600px]"
        data-testid="skills-canvas-wrapper"
        variants={fadeInUp}
      >
        <ConstellationCanvas />
      </motion.div>
    </motion.section>
  )
}
