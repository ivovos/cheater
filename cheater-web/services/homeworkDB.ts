/**
 * Homework Database Service
 * Handles all homework-related database operations
 */

import { supabase, signInAnonymously } from './supabase';
import { Homework } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class HomeworkDB {
  /**
   * Fetch all homework for the current user
   * Includes quiz and progress data
   */
  static async getAll(): Promise<Homework[]> {
    const { data, error } = await supabase
      .from('homework')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching homework:', error);
      throw error;
    }

    return data.map((hw) => this.mapToHomework(hw));
  }

  /**
   * Get single homework by ID
   */
  static async getById(id: string): Promise<Homework | null> {
    const { data, error } = await supabase
      .from('homework')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching homework:', error);
      throw error;
    }

    return data ? this.mapToHomework(data) : null;
  }

  /**
   * Create new homework
   */
  static async create(
    title: string,
    imageUrl: string,
    subject?: string,
    ocrText?: string
  ): Promise<Homework> {
    // Check if user is authenticated
    let {
      data: { user }
    } = await supabase.auth.getUser();

    // If not authenticated, sign in anonymously
    if (!user) {
      console.log('User not authenticated, signing in anonymously...');
      await signInAnonymously();
      const result = await supabase.auth.getUser();
      user = result.data.user;
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    const id = uuidv4();

    const { data, error } = await supabase
      .from('homework')
      .insert({
        id,
        user_id: user.id,
        title,
        subject,
        image_url: imageUrl,
        ocr_text: ocrText
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating homework:', error);
      throw error;
    }

    return this.mapToHomework(data);
  }

  /**
   * Update homework
   */
  static async update(
    id: string,
    updates: {
      title?: string;
      subject?: string;
      ocrText?: string;
    }
  ): Promise<Homework> {
    const { data, error } = await supabase
      .from('homework')
      .update({
        title: updates.title,
        subject: updates.subject,
        ocr_text: updates.ocrText
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating homework:', error);
      throw error;
    }

    return this.mapToHomework(data);
  }

  /**
   * Delete homework
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('homework').delete().eq('id', id);

    if (error) {
      console.error('Error deleting homework:', error);
      throw error;
    }
  }

  /**
   * Upload homework image to Supabase Storage
   */
  static async uploadImage(
    file: Blob,
    homeworkId: string
  ): Promise<string> {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const fileName = `${user.id}/${homeworkId}.jpg`;

    const { data, error } = await supabase.storage
      .from('homework-images')
      .upload(fileName, file, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl }
    } = supabase.storage.from('homework-images').getPublicUrl(data.path);

    return publicUrl;
  }

  /**
   * Map database row to Homework model
   */
  private static mapToHomework(data: any): Homework {
    const progress = data.progress?.[0] || data.progress;

    return {
      id: data.id,
      title: data.title,
      subject: data.subject || undefined,
      imageURL: data.image_url,
      ocrText: data.ocr_text || undefined,
      createdAt: new Date(data.created_at),
      bestScore: progress?.best_score || undefined,
      totalAttempts: progress?.total_attempts || 0,
      completionPercentage: progress?.completion_percentage || 0,
      lastPlayedAt: progress?.last_played_at
        ? new Date(progress.last_played_at)
        : undefined
    };
  }
}
