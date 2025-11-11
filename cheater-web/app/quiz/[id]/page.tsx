'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useQuizStore } from '@/stores/quizStore'
import { useHomeworkStore } from '@/stores/homeworkStore'
import { AppLayout } from '@/components/AppLayout'

export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const homeworkId = params.id as string

  const {
    currentQuiz,
    currentQuestionIndex,
    userAnswers,
    showResults,
    score,
    loadQuiz,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    getCurrentQuestion,
    getAnswerForQuestion,
    isQuestionAnswered,
    canGoNext,
    canGoPrevious,
    getProgress
  } = useQuizStore()

  const { homework } = useHomeworkStore()

  const [loading, setLoading] = React.useState(true)

  // Load quiz on mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        await loadQuiz(homeworkId)
        setLoading(false)
      } catch (error) {
        console.error('Error loading quiz:', error)
        alert('Failed to load quiz')
        router.push('/')
      }
    }

    loadData()
  }, [homeworkId])

  const currentQuestion = getCurrentQuestion()
  const currentAnswer = currentQuestion ? getAnswerForQuestion(currentQuestion.id) : undefined
  const progress = getProgress()

  if (loading || !currentQuiz) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="p-12 text-center">
              <p className="text-body text-gray-500">Loading quiz...</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  if (showResults) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="text-center">
                <div className="mb-4">
                  {score >= 7 ? (
                    <CheckCircle className="w-20 h-20 text-success mx-auto" />
                  ) : (
                    <XCircle className="w-20 h-20 text-error mx-auto" />
                  )}
                </div>
                <CardTitle className="text-3xl">
                  {score >= 9 ? '🌟 Excellent!' : score >= 7 ? '👍 Good Job!' : score >= 5 ? '😊 Not Bad!' : '💪 Keep Practicing!'}
                </CardTitle>
                <CardDescription>
                  You scored {score} out of {currentQuiz.questions.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {Math.round((score / currentQuiz.questions.length) * 100)}%
                  </div>
                  <p className="text-body text-foreground-secondary">
                    {score} correct answers
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      startQuiz()
                    }}
                  >
                    Try Again
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => router.push('/')}
                  >
                    Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </AppLayout>
    )
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Question {currentQuestionIndex + 1}/{currentQuiz.questions.length}
            </h1>
          </div>
          <Progress value={progress} />
        </div>
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{currentQuestion.question}</CardTitle>
              <CardDescription>
                {currentQuestion.type === 'mcq' && 'Select the correct answer'}
                {currentQuestion.type === 'fillBlank' && 'Fill in the blank'}
                {currentQuestion.type === 'shortAnswer' && 'Type your answer'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* MCQ Options */}
              {currentQuestion.type === 'mcq' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={currentAnswer === index ? 'default' : 'outline'}
                      className="w-full justify-start text-left h-auto py-4"
                      onClick={() => answerQuestion(currentQuestion.id, index)}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {/* Fill Blank / Short Answer */}
              {(currentQuestion.type === 'fillBlank' || currentQuestion.type === 'shortAnswer') && (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Type your answer..."
                    value={(currentAnswer as string) || ''}
                    onChange={(e) => answerQuestion(currentQuestion.id, e.target.value)}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={previousQuestion}
                  disabled={!canGoPrevious()}
                >
                  Previous
                </Button>
                {canGoNext() ? (
                  <Button
                    className="flex-1"
                    onClick={nextQuestion}
                    disabled={!isQuestionAnswered(currentQuestion.id)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    onClick={submitQuiz}
                    disabled={userAnswers.size !== currentQuiz.questions.length}
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>

              {/* Answer Status */}
              <div className="text-center text-caption1 text-foreground-tertiary">
                {userAnswers.size} of {currentQuiz.questions.length} questions answered
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}
