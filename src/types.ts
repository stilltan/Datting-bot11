declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export type Language = 'ru' | 'en';
export type Theme = 'light' | 'dark';

export type QuestionType = 'text' | 'textarea' | 'email' | 'radio' | 'checkbox' | 'file' | 'scale';

export interface Question {
  id: string;
  text: { ru: string; en: string };
  req: boolean;
  type: QuestionType;
  options?: { ru: string[]; en: string[] };
  section: string;
  hint?: { ru: string; en: string };
  skipIf?: { id: string; value: string | string[] };
  minPhotos?: number;
}

export interface FormData {
  [key: string]: string | string[] | File[];
}

export interface Section {
  id: string;
  title: { ru: string; en: string };
  icon: string;
  description: { ru: string; en: string };
}
