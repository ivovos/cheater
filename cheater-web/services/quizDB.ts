/**
 * Quiz Database Service
 * Handles all quiz-related database operations
 */

import { supabase } from './supabase';
import { Quiz, Question } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class QuizDB {
  /**
   * Get quiz for homework
   */
  static async getByHomeworkId(homeworkId: string): Promise<Quiz | null> {
    const { data, error } = await supabase
      .from('quiz')
      .select('*')
      .eq('homework_id', homeworkId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No quiz found
        return null;
      }
      console.error('Error fetching quiz:', error);
      throw error;
    }

    return this.mapToQuiz(data);
  }

  /**
   * Create new quiz
   */
  static async create(quiz: Quiz): Promise<Quiz> {
    const { data, error } = await supabase
      .from('quiz')
      .insert({
        id: quiz.id,
        homework_id: quiz.homeworkId,
        questions: quiz.questions,
        topic: quiz.topic,
        subtopic: quiz.subtopic,
        classification_confidence: quiz.classificationConfidence
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }

    return this.mapToQuiz(data);
  }

  /**
   * Save quiz attempt
   */
  static async saveAttempt(
    quizId: string,
    score: number,
    answers: Array<{
      questionId: string;
      userAnswer: string | number;
      correct: boolean;
    }>,
    timeTaken?: number
  ): Promise<void> {
    const { error } = await supabase.from('quiz_attempts').insert({
      id: uuidv4(),
      quiz_id: quizId,
      score,
      total_questions: 10,
      time_taken_seconds: timeTaken,
      answers
    });

    if (error) {
      console.error('Error saving quiz attempt:', error);
      throw error;
    }
  }

  /**
   * Get quiz attempt history
   */
  static async getAttempts(quizId: string): Promise<
    Array<{
      id: string;
      score: number;
      completedAt: Date;
      timeTaken?: number;
    }>
  > {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('quiz_id', quizId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching quiz attempts:', error);
      throw error;
    }

    return data.map((attempt) => ({
      id: attempt.id,
      score: attempt.score,
      completedAt: new Date(attempt.completed_at),
      timeTaken: attempt.time_taken_seconds || undefined
    }));
  }

  /**
   * Update homework progress after quiz attempt
   */
  static async updateProgress(
    homeworkId: string,
    score: number
  ): Promise<void> {
    const { error } = await supabase.rpc('update_homework_progress', {
      p_homework_id: homeworkId,
      p_score: score,
      p_total_questions: 10
    });

    if (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  /**
   * Map database row to Quiz model
   */
  private static mapToQuiz(data: any): Quiz {
    return {
      id: data.id,
      homeworkId: data.homework_id,
      questions: data.questions as Question[],
      createdAt: new Date(data.created_at),
      topic: data.topic || undefined,
      subtopic: data.subtopic || undefined,
      classificationConfidence: data.classification_confidence || undefined
    };
  }
}
