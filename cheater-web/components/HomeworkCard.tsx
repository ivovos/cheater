/**
 * HomeworkCard Component
 * Displays a homework assignment card with image, title, and progress
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Homework } from '@/types'
import { cn } from '@/lib/utils'
import { cardMotion } from '@/lib/motion'

interface HomeworkCardProps {
  homework: Homework
  onPress: () => void
  className?: string
}

export const HomeworkCard: React.FC<HomeworkCardProps> = ({
  homework,
  onPress,
  className,
}) => {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardMotion}
      onClick={onPress}
      className={cn(
        'flex flex-row overflow-hidden rounded-card bg-card shadow-card cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className
      )}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPress()
        }
      }}
    >
      {/* Thumbnail */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
        <Image
          src={homework.imageURL}
          alt={homework.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 96px, 128px"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-4">
        {/* Title */}
        <h3 className="text-headline text-foreground line-clamp-2 mb-1">
          {homework.title}
        </h3>

        {/* Subject Badge */}
        {homework.subject && (
          <div className="inline-flex self-start px-2 py-1 rounded-pill bg-primary-tint mb-2">
            <span className="text-caption1 font-semibold text-primary">
              {homework.subject}
            </span>
          </div>
        )}

        {/* Progress Info */}
        <div className="flex flex-row gap-4 mt-auto">
          {homework.completionPercentage > 0 && (
            <div className="flex flex-col">
              <span className="text-callout font-semibold text-success">
                {homework.completionPercentage}%
              </span>
              <span className="text-caption2 text-foreground-secondary">
                Completed
              </span>
            </div>
          )}

          {homework.bestScore !== undefined && (
            <div className="flex flex-col">
              <span className="text-callout font-semibold text-primary">
                {homework.bestScore}/10
              </span>
              <span className="text-caption2 text-foreground-secondary">
                Best Score
              </span>
            </div>
          )}

          {homework.totalAttempts > 0 && (
            <div className="flex flex-col">
              <span className="text-callout font-semibold text-foreground">
                {homework.totalAttempts}
              </span>
              <span className="text-caption2 text-foreground-secondary">
                {homework.totalAttempts === 1 ? 'Attempt' : 'Attempts'}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
