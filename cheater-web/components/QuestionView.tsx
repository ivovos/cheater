/**
 * QuestionView Component
 * Displays a question with appropriate input based on type (MCQ, fill-blank, short-answer)
 */

'use client'

import * as React from 'react'
import { Question, QuestionType } from '@/types'
import { AnswerButton } from './AnswerButton'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { cn } from '@/lib/utils'

interface QuestionViewProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  userAnswer?: string | number
  showFeedback?: boolean
  onAnswerSelect: (answer: string | number) => void
  disabled?: boolean
  className?: string
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  showFeedback = false,
  onAnswerSelect,
  disabled = false,
  className,
}) => {
  const [textAnswer, setTextAnswer] = React.useState('')

  const handleTextChange = (text: string) => {
    setTextAnswer(text)
    onAnswerSelect(text)
  }

  const getOptionState = (index: number) => {
    if (!showFeedback) {
      return userAnswer === index ? 'selected' : 'default'
    }

    if (index === question.correctIndex) {
      return 'correct'
    }
    if (userAnswer === index) {
      return 'incorrect'
    }
    return 'default'
  }

  const getQuestionTypeLabel = () => {
    switch (question.type) {
      case QuestionType.MCQ:
        return 'Multiple Choice'
      case QuestionType.FillBlank:
        return 'Fill in Blank'
      case QuestionType.ShortAnswer:
        return 'Short Answer'
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Question Header */}
      <div className="flex items-center justify-between">
        <p className="text-callout font-semibold text-foreground-secondary">
          Question {questionNumber} of {totalQuestions}
        </p>
        <div className="px-3 py-1 rounded-pill bg-primary-tint">
          <p className="text-caption1 font-semibold text-primary">
            {getQuestionTypeLabel()}
          </p>
        </div>
      </div>

      {/* Question Text */}
      <h2 className="text-title-2 text-foreground">
        {question.question}
      </h2>

      {/* Answer Input */}
      <div className="flex-1">
        {question.type === QuestionType.MCQ && question.options ? (
          // MCQ Options
          <div className="flex flex-col gap-3">
            {question.options.map((option, index) => (
              <AnswerButton
                key={index}
                label={`${['A', 'B', 'C', 'D'][index]}. ${option}`}
                onPress={() => onAnswerSelect(index)}
                state={getOptionState(index)}
                disabled={disabled}
              />
            ))}
          </div>
        ) : (
          // Text Input for fill-blank and short-answer
          <div className="space-y-4">
            {question.type === QuestionType.ShortAnswer ? (
              <Textarea
                placeholder="Type your answer..."
                value={textAnswer}
                onChange={(e) => handleTextChange(e.target.value)}
                disabled={disabled}
                className="min-h-[120px] text-base"
              />
            ) : (
              <Input
                placeholder="Type your answer..."
                value={textAnswer}
                onChange={(e) => handleTextChange(e.target.value)}
                disabled={disabled}
                className="text-base"
              />
            )}

            {/* Show correct answer in feedback mode */}
            {showFeedback && (
              <div className="p-4 rounded-card bg-success-tint">
                <p className="text-caption1 font-semibold text-success mb-1">
                  Correct Answer:
                </p>
                <p className="text-body font-semibold text-foreground">
                  {question.correctAnswer}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Explanation (shown in feedback mode) */}
      {showFeedback && question.explanation && (
        <div className="p-4 rounded-card bg-background-secondary">
          <p className="text-caption1 font-semibold text-foreground-secondary mb-1">
            Explanation
          </p>
          <p className="text-body text-foreground">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
