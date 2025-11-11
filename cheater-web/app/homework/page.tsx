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

export default function HomeworkListPage() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Homework</h1>
          <p className="text-gray-600 mt-1">Keep learning and improving every day</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-xl">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-900">{streak}</p>
                  <p className="text-xs text-orange-700 font-medium">Day Streak</p>
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
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{totalQuizzes}</p>
                  <p className="text-xs text-blue-700 font-medium">Total Quizzes</p>
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
            <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900">{completedQuizzes}</p>
                  <p className="text-xs text-green-700 font-medium">Completed</p>
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
            <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-xl">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">{averageScore}%</p>
                  <p className="text-xs text-purple-700 font-medium">Avg Score</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Homework List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
            <Button
              onClick={() => router.push('/capture')}
              className="bg-primary hover:bg-primary-hover text-white rounded-xl px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Quiz
            </Button>
          </div>

          {homework.length === 0 ? (
            <Card className="p-12 text-center bg-white">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
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
                  className="bg-primary hover:bg-primary-hover text-white rounded-xl px-8 py-6 text-base font-semibold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Quiz
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {homework.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card
                    className="p-5 hover:shadow-lg transition-shadow cursor-pointer bg-white"
                    onClick={() => router.push(`/quiz/${item.id}`)}
                  >
                    {/* Image Thumbnail */}
                    {item.imageURL && (
                      <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={item.imageURL}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                          {item.title}
                        </h3>
                        {item.subject && (
                          <p className="text-sm text-gray-600 mt-1">{item.subject}</p>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {item.bestScore !== undefined && (
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{item.bestScore}/10</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{item.totalAttempts} attempts</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {item.completionPercentage > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Progress</span>
                            <span>{item.completionPercentage}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${item.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Date */}
                      <p className="text-xs text-gray-500">
                        {format(new Date(item.createdAt), 'MMM d, yyyy')}
                      </p>

                      {/* Play Button */}
                      <Button
                        className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-5 font-semibold mt-4"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/quiz/${item.id}`)
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Quiz
                      </Button>
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
