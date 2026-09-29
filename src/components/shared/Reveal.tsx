import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

interface Props extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  y?: number
  once?: boolean
}

/** Bloco que sobe e aparece ao entrar na viewport. */
export default function Reveal({ children, delay = 0, y = 24, once = true, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
