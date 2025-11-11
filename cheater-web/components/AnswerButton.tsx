/**
 * AnswerButton Component
 * Button for quiz answer options with state (default, selected, correct, incorrect)
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'

interface AnswerButtonProps {
  label: string
  onPress: () => void
  state?: 'default' | 'selected' | 'correct' | 'incorrect'
  disabled?: boolean
  className?: string
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  label,
  onPress,
  state = 'default',
  disabled = false,
  className,
}) => {
  const getStateStyles = () => {
    switch (state) {
      case 'selected':
        return 'bg-primary text-white border-primary'
      case 'correct':
        return 'bg-success text-white border-success'
      case 'incorrect':
        return 'bg-error text-white border-error'
      default:
        return 'bg-card text-foreground border-border hover:bg-background-secondary'
    }
  }

  return (
    <motion.button
      onClick={onPress}
      disabled={disabled}
      whileHover={!disabled && state === 'default' ? { scale: 1.02, y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={spring.snappy}
      className={cn(
        'w-full px-6 py-4 rounded-button text-left text-base font-semibold',
        'border-2 transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        state === 'default' && 'shadow-button',
        getStateStyles(),
        className
      )}
    >
      {label}
    </motion.button>
  )
}
