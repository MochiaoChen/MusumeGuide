export enum ViewState {
  HOME = 'HOME',
  GUIDE = 'GUIDE',
  CULTURE = 'CULTURE'
}

export interface Artifact {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

// Minimal type definitions needed for the Live API if not fully covered by the SDK types in this context
// We mostly rely on @google/genai types, but these help with state management.
export interface ChatLog {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
