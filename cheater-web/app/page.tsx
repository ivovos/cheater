'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useHomeworkStore } from '@/stores/homeworkStore'
import { Flame, Clock, Target, TrendingUp, Plus, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

export default function Home() {
  const router = useRouter()
  const { homework, loadHomework, isLoading } = useHomeworkStore()

  React.useEffect(() => {
    loadHomework()
  }, [loadHomework])

  // Calculate stats
  const totalQuizzes = homework.length
  const completedQuizzes = homework.filter(h => h.completionPercentage === 100).length
  const averageScore = homework.length > 0
    ? Math.round(homework.reduce((sum, h) => sum + (h.bestScore || 0), 0) / homework.length)
    : 0
  const streak = 1 // TODO: Calculate actual streak

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Homework</h1>
          <p className="text-gray-600 mt-1">Keep learning and improving every day</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-xl">
                  <Flame className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{streak}</p>
                  <p className="text-xs text-gray-600">Day Streak</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Total Quizzes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-xl">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{totalQuizzes}</p>
                  <p className="text-xs text-gray-600">Total Quizzes</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Completed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success rounded-xl">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{completedQuizzes}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Average Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-xl">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{averageScore}%</p>
                  <p className="text-xs text-gray-600">Avg Score</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Homework List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
            <Button
              onClick={() => router.push('/capture')}
              className="bg-primary hover:bg-primary-hover text-white rounded-xl px-6 hidden lg:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Quiz
            </Button>
          </div>

          {homework.length === 0 ? (
            <Card className="p-12 text-center bg-white border-gray-200 shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No homework yet
                  </h3>
                  <p className="text-gray-600">
                    Get started by creating your first quiz from a homework image
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/capture')}
                  className="bg-primary hover:bg-primary-hover text-white rounded-xl px-8 py-6 text-base font-semibold shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Quiz
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {homework.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200 shadow-sm group"
                    onClick={() => router.push(`/quiz/${item.id}`)}
                  >
                    {/* Image Thumbnail */}
                    {item.imageURL && (
                      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                        <img
                          src={item.imageURL}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                        {item.subject && (
                          <p className="text-sm text-gray-500">{item.subject}</p>
                        )}
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {item.bestScore !== undefined && (
                          <div className="flex items-center gap-1.5">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                              <Target className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="font-medium">{item.bestScore}/10</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <div className="p-1.5 bg-gray-100 rounded-lg">
                            <Clock className="h-3.5 w-3.5 text-gray-600" />
                          </div>
                          <span>{item.totalAttempts} {item.totalAttempts === 1 ? 'attempt' : 'attempts'}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {item.completionPercentage > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-primary">{item.completionPercentage}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${item.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          {format(new Date(item.createdAt), 'MMM d, yyyy')}
                        </p>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-2 text-sm font-semibold group-hover:shadow-md transition-shadow"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/quiz/${item.id}`)
                          }}
                        >
                          <Play className="h-3.5 w-3.5 mr-1.5" />
                          Start
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
