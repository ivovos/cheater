/**
 * Capture Store
 * Manages the photo capture/upload flow and quiz generation
 * Uses Zustand for state management
 */

import { create } from 'zustand';

export type CaptureFlowState =
  | 'idle'
  | 'capturing'
  | 'imageSelected'
  | 'generatingQuiz'
  | 'saving'
  | 'completed'
  | 'error';

interface CaptureState {
  // State
  flowState: CaptureFlowState;
  selectedImage: string | null;
  imageBlob: Blob | null;
  homeworkTitle: string;
  homeworkSubject: string;
  error: string | null;

  // Actions
  selectImage: (uri: string, blob?: Blob) => void;
  setTitle: (title: string) => void;
  setSubject: (subject: string) => void;
  startGenerating: () => void;
  startSaving: () => void;
  complete: () => void;
  setError: (error: string) => void;
  reset: () => void;
  clearError: () => void;
}

export const useCaptureStore = create<CaptureState>((set) => ({
  // Initial state
  flowState: 'idle',
  selectedImage: null,
  imageBlob: null,
  homeworkTitle: '',
  homeworkSubject: '',
  error: null,

  // Select image
  selectImage: (uri: string, blob?: Blob) => {
    set({
      selectedImage: uri,
      imageBlob: blob || null,
      flowState: 'imageSelected',
      error: null
    });
  },

  // Set homework title
  setTitle: (title: string) => {
    set({ homeworkTitle: title });
  },

  // Set homework subject
  setSubject: (subject: string) => {
    set({ homeworkSubject: subject });
  },

  // Start generating quiz
  startGenerating: () => {
    set({ flowState: 'generatingQuiz', error: null });
  },

  // Start saving
  startSaving: () => {
    set({ flowState: 'saving', error: null });
  },

  // Complete flow
  complete: () => {
    set({ flowState: 'completed' });
  },

  // Set error
  setError: (error: string) => {
    set({ error, flowState: 'error' });
  },

  // Reset flow
  reset: () => {
    set({
      flowState: 'idle',
      selectedImage: null,
      imageBlob: null,
      homeworkTitle: '',
      homeworkSubject: '',
      error: null
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));
