import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { aiService } from './services/aiService';
import { HomeworkDB } from './services/homeworkDB';
import { QuizDB } from './services/quizDB';
import { signInAnonymously, isSupabaseConfigured } from './services/supabase';
import { Quiz, Homework } from './types';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [homework, setHomework] = useState<Homework | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auto sign-in on mount
  useEffect(() => {
    const init = async () => {
      if (!isSupabaseConfigured()) {
        console.warn('⚠️  Supabase not configured. Database features disabled.');
        return;
      }

      try {
        console.log('🔐 Signing in anonymously...');
        await signInAnonymously();
        setIsAuthenticated(true);
        console.log('✅ Signed in successfully!');
      } catch (err) {
        console.error('❌ Sign-in failed:', err);
      }
    };

    init();
  }, []);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permission is required');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      setQuiz(null);
      setHomework(null);
      setError(null);

      // Convert to blob for web upload
      if (uri.startsWith('blob:') || uri.startsWith('data:')) {
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          setImageBlob(blob);
        } catch (err) {
          console.error('Failed to convert image to blob:', err);
        }
      }
    }
  };

  const testAIService = async () => {
    if (!selectedImage) {
      Alert.alert('No image', 'Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setQuiz(null);
    setHomework(null);

    try {
      // Step 1: Generate quiz with AI
      setLoadingMessage('Generating quiz with AI...');
      console.log('🧪 Generating quiz with AI...');
      const generatedQuiz = await aiService.generateQuiz(selectedImage);
      setQuiz(generatedQuiz);
      console.log('✅ Quiz generated successfully!');

      // Step 2: Save to database (if Supabase is configured)
      if (isSupabaseConfigured() && isAuthenticated) {
        // Upload image to storage
        setLoadingMessage('Uploading image...');
        console.log('📤 Uploading image to Supabase Storage...');

        let imageUrl: string;
        if (imageBlob) {
          // Web: Upload blob
          const tempHomeworkId = generatedQuiz.id; // Use quiz ID temporarily
          imageUrl = await HomeworkDB.uploadImage(imageBlob, tempHomeworkId);
        } else {
          // For now, use the local URI (in production, you'd upload the file)
          imageUrl = selectedImage;
        }

        // Create homework record
        setLoadingMessage('Saving homework...');
        console.log('💾 Creating homework record...');
        const title = generatedQuiz.topic
          ? `${generatedQuiz.topic}${generatedQuiz.subtopic ? ' - ' + generatedQuiz.subtopic : ''}`
          : 'Homework Quiz';

        const newHomework = await HomeworkDB.create(
          title,
          imageUrl,
          generatedQuiz.topic,
          undefined // No OCR text since we use Vision API
        );
        setHomework(newHomework);
        console.log('✅ Homework created:', newHomework.id);

        // Save quiz to database
        setLoadingMessage('Saving quiz...');
        console.log('💾 Saving quiz to database...');
        generatedQuiz.homeworkId = newHomework.id;
        await QuizDB.create(generatedQuiz);
        console.log('✅ Quiz saved to database!');

        console.log('🎉 All data saved successfully!');
      } else {
        console.log('ℹ️  Supabase not configured - skipping database save');
      }

    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🧪 AI Service Test</Text>
        <Text style={styles.subtitle}>Test Claude Vision API Integration</Text>

        <View style={styles.section}>
          <Button title="📷 Pick an Image" onPress={pickImage} />
        </View>

        {selectedImage && (
          <View style={styles.section}>
            <Text style={styles.label}>Selected Image:</Text>
            <Image source={{ uri: selectedImage }} style={styles.image} />
          </View>
        )}

        {selectedImage && (
          <View style={styles.section}>
            <Button
              title="🚀 Generate Quiz"
              onPress={testAIService}
              disabled={loading}
            />
          </View>
        )}

        {loading && (
          <View style={styles.section}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>
              {loadingMessage || 'Generating quiz...'}
            </Text>
            <Text style={styles.hint}>This may take 30-60 seconds</Text>
          </View>
        )}

        {error && (
          <View style={[styles.section, styles.errorBox]}>
            <Text style={styles.errorTitle}>❌ Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {quiz && (
          <View style={[styles.section, styles.successBox]}>
            <Text style={styles.successTitle}>
              ✅ Quiz Generated{homework ? ' & Saved!' : '!'}
            </Text>
            {homework && (
              <>
                <Text style={styles.infoText}>📝 Homework ID: {homework.id.substring(0, 8)}...</Text>
                <Text style={styles.infoText}>📚 Title: {homework.title}</Text>
              </>
            )}
            <Text style={styles.infoText}>Topic: {quiz.topic || 'generic'}</Text>
            <Text style={styles.infoText}>Subtopic: {quiz.subtopic || 'N/A'}</Text>
            <Text style={styles.infoText}>
              Confidence: {quiz.classificationConfidence
                ? `${Math.round(quiz.classificationConfidence * 100)}%`
                : 'N/A'}
            </Text>
            <Text style={styles.infoText}>Questions: {quiz.questions.length}</Text>

            <View style={styles.questionsList}>
              <Text style={styles.questionsTitle}>Questions:</Text>
              {quiz.questions.map((q, index) => (
                <View key={q.id} style={styles.questionItem}>
                  <Text style={styles.questionNumber}>Q{index + 1}. ({q.type})</Text>
                  <Text style={styles.questionText}>{q.question}</Text>
                  {q.type === 'mcq' && q.options && (
                    <View style={styles.options}>
                      {q.options.map((opt, i) => (
                        <Text
                          key={i}
                          style={[
                            styles.option,
                            i === q.correctIndex && styles.correctOption
                          ]}
                        >
                          {['A', 'B', 'C', 'D'][i]}. {opt}
                          {i === q.correctIndex && ' ✓'}
                        </Text>
                      ))}
                    </View>
                  )}
                  {(q.type === 'fillBlank' || q.type === 'shortAnswer') && (
                    <Text style={styles.answer}>Answer: {q.correctAnswer}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef5350',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#66bb6a',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1b5e20',
    marginBottom: 4,
  },
  questionsList: {
    marginTop: 16,
  },
  questionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 12,
  },
  questionItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  options: {
    marginTop: 8,
  },
  option: {
    fontSize: 13,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  correctOption: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  answer: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2e7d32',
    marginTop: 8,
  },
});
