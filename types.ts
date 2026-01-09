
export interface VideoData {
  id: string;
  title: string;
  url: string; // Blob URL or Generated URL
  thumbnail: string; // Base64 encoded image
  duration: string;
  uploadDate: string;
  fileSize: string;
  aiSummary?: string;
  aiTags?: string[];
  isAnalyzing?: boolean;
  isSynced?: boolean;
  isGenerated?: boolean;
  prompt?: string;
}

export interface GeminiAnalysisResponse {
  summary: string;
  tags: string[];
  suggestedTitle: string;
}
