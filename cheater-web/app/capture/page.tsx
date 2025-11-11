'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Camera, Upload, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCaptureStore } from '@/stores/captureStore'
import { useHomeworkStore } from '@/stores/homeworkStore'
import { useQuizStore } from '@/stores/quizStore'
import { AppLayout } from '@/components/AppLayout'

export default function CapturePage() {
  const router = useRouter()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [preview, setPreview] = React.useState<string | null>(null)

  const { flowState, setError, selectImage, reset } = useCaptureStore()
  const { createHomework, uploadImage } = useHomeworkStore()
  const { generateQuiz } = useQuizStore()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      selectImage(result, file)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!preview) {
      alert('Please select an image first')
      return
    }

    try {
      // 1. Generate quiz using AI (this will also generate title/subject)
      const quizData = await generateQuiz(preview)

      // 2. Create homework entry with AI-generated title and subject
      const homework = await createHomework(
        quizData.title || 'Homework Assignment',
        preview,
        quizData.subject
      )

      // 3. Link quiz to homework and save to database
      quizData.quiz.homeworkId = homework.id
      const { QuizDB } = await import('@/services/quizDB')
      await QuizDB.create(quizData.quiz)

      // Success - navigate to quiz
      router.push(`/quiz/${homework.id}`)
    } catch (error: any) {
      console.error('Error generating quiz:', error)
      setError(error.message || 'Failed to generate quiz')
      alert('Failed to generate quiz. Please try again.')
    }
  }

  const handleReset = () => {
    setPreview(null)
    reset()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upload Homework Image</CardTitle>
              <CardDescription>
                Take a photo or upload an image of your homework assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Homework Image</Label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => {
                      // Browser camera capture using input file with capture attribute
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.capture = 'environment'
                      input.onchange = (e: any) => {
                        const file = e.target?.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (e) => {
                            const result = e.target?.result as string
                            setPreview(result)
                            selectImage(result, file)
                          }
                          reader.readAsDataURL(file)
                        }
                      }
                      input.click()
                    }}
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </Button>
                </div>
                <Input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Image Preview */}
              {preview && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="relative rounded-lg overflow-hidden border border-border bg-background-secondary">
                    <img
                      src={preview}
                      alt="Homework preview"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </div>
              )}

              {!preview && (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                  <ImageIcon className="w-12 h-12 text-foreground-tertiary mx-auto mb-4" />
                  <p className="text-body text-foreground-secondary">
                    No image selected
                  </p>
                  <p className="text-caption1 text-foreground-tertiary mt-1">
                    Click "Choose Image" or "Take Photo" to get started
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleReset}
                  disabled={flowState === 'generatingQuiz'}
                >
                  Reset
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleGenerate}
                  disabled={!preview || flowState === 'generatingQuiz'}
                >
                  {flowState === 'generatingQuiz' ? (
                    <>
                      <Spinner size="sm" />
                      Generating Quiz...
                    </>
                  ) : (
                    'Generate Quiz'
                  )}
                </Button>
              </div>

              {/* Info */}
              <div className="bg-primary-tint border border-primary/20 rounded-lg p-4 text-sm">
                <p className="text-foreground">
                  ✨ <strong>AI-Powered:</strong> Claude will automatically analyze your homework and create a title, subject, and quiz questions for you.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}
