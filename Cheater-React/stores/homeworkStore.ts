/**
 * Homework Store
 * Manages homework list, loading, and CRUD operations
 * Uses Zustand for state management
 */

import { create } from 'zustand';
import { Homework } from '../types';
import { HomeworkDB } from '../services/homeworkDB';

interface HomeworkState {
  // State
  homework: Homework[];
  selectedHomework: Homework | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadHomework: () => Promise<void>;
  selectHomework: (homework: Homework | null) => void;
  createHomework: (
    title: string,
    imageUrl: string,
    subject?: string,
    ocrText?: string
  ) => Promise<Homework>;
  updateHomework: (
    id: string,
    updates: { title?: string; subject?: string; ocrText?: string }
  ) => Promise<void>;
  deleteHomework: (id: string) => Promise<void>;
  uploadImage: (file: Blob, homeworkId: string) => Promise<string>;
  clearError: () => void;
}

export const useHomeworkStore = create<HomeworkState>((set, get) => ({
  // Initial state
  homework: [],
  selectedHomework: null,
  isLoading: false,
  error: null,

  // Load all homework
  loadHomework: async () => {
    set({ isLoading: true, error: null });

    try {
      const homework = await HomeworkDB.getAll();
      set({ homework, isLoading: false });
    } catch (error: any) {
      console.error('Error loading homework:', error);
      set({
        error: error.message || 'Failed to load homework',
        isLoading: false
      });
    }
  },

  // Select homework for detail view
  selectHomework: (homework: Homework | null) => {
    set({ selectedHomework: homework });
  },

  // Create new homework
  createHomework: async (
    title: string,
    imageUrl: string,
    subject?: string,
    ocrText?: string
  ) => {
    set({ isLoading: true, error: null });

    try {
      const newHomework = await HomeworkDB.create(
        title,
        imageUrl,
        subject,
        ocrText
      );

      // Add to list
      set((state) => ({
        homework: [newHomework, ...state.homework],
        isLoading: false
      }));

      return newHomework;
    } catch (error: any) {
      console.error('Error creating homework:', error);
      set({
        error: error.message || 'Failed to create homework',
        isLoading: false
      });
      throw error;
    }
  },

  // Update homework
  updateHomework: async (
    id: string,
    updates: { title?: string; subject?: string; ocrText?: string }
  ) => {
    set({ isLoading: true, error: null });

    try {
      const updated = await HomeworkDB.update(id, updates);

      // Update in list
      set((state) => ({
        homework: state.homework.map((hw) => (hw.id === id ? updated : hw)),
        selectedHomework:
          state.selectedHomework?.id === id ? updated : state.selectedHomework,
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error updating homework:', error);
      set({
        error: error.message || 'Failed to update homework',
        isLoading: false
      });
      throw error;
    }
  },

  // Delete homework
  deleteHomework: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await HomeworkDB.delete(id);

      // Remove from list
      set((state) => ({
        homework: state.homework.filter((hw) => hw.id !== id),
        selectedHomework:
          state.selectedHomework?.id === id ? null : state.selectedHomework,
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error deleting homework:', error);
      set({
        error: error.message || 'Failed to delete homework',
        isLoading: false
      });
      throw error;
    }
  },

  // Upload image
  uploadImage: async (file: Blob, homeworkId: string) => {
    try {
      return await HomeworkDB.uploadImage(file, homeworkId);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      set({ error: error.message || 'Failed to upload image' });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));
