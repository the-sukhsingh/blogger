/**
 * Book Store & Typography Utilities for Print-on-Demand & Multi-Chapter Manuscripts
 */

export interface PrintSettings {
  trimSize: '6x9' | '5.5x8.5' | '7x10' | 'a5' | 'a4' | 'letter'
  fontFamily: 'serif' | 'sans' | 'mono'
  fontSizePt: number
  lineSpacing: number
  gutterMarginIn: number
  outerMarginIn: number
  justifyText: boolean
  firstLineIndent: boolean
  includeToC: boolean
  showPageNumbers: boolean
  runningHeaders: boolean
}

export const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  trimSize: '6x9',
  fontFamily: 'serif',
  fontSizePt: 11,
  lineSpacing: 1.4,
  gutterMarginIn: 0.75,
  outerMarginIn: 0.5,
  justifyText: true,
  firstLineIndent: true,
  includeToC: true,
  showPageNumbers: true,
  runningHeaders: true,
}

export interface BookChapter {
  _id?: string
  id?: string
  bookId: string
  title: string
  slug: string
  order: number
  content: string
  status: 'draft' | 'published'
  excerpt?: string
  createdAt: number
  updatedAt: number
}

export interface Book {
  _id?: string
  id?: string
  title: string
  subtitle?: string
  slug: string
  description?: string
  author: string
  coverImage?: string
  status: 'draft' | 'published'
  language: string
  direction: 'ltr' | 'rtl'
  genre?: string
  isbn?: string
  printSettings: PrintSettings
  shareToken: string
  isPublicLinkEnabled: boolean
  chapterCount?: number
  totalWords?: number
  chapters?: BookChapter[]
  createdAt: number
  updatedAt: number
}

export const TRIM_SIZE_SPECS: Record<
  PrintSettings['trimSize'],
  { name: string; widthIn: number; heightIn: number; label: string; description: string }
> = {
  '6x9': {
    name: 'Trade Paperback',
    widthIn: 6.0,
    heightIn: 9.0,
    label: '6" × 9"',
    description: 'Standard for technical books, memoirs, and non-fiction',
  },
  '5.5x8.5': {
    name: 'Digest / Handbook',
    widthIn: 5.5,
    heightIn: 8.5,
    label: '5.5" × 8.5"',
    description: 'Compact format for guides, essays, and novellas',
  },
  '7x10': {
    name: 'Technical Manual',
    widthIn: 7.0,
    heightIn: 10.0,
    label: '7" × 10"',
    description: 'Wide format for manuals, code architectures, and textbooks',
  },
  a5: {
    name: 'A5 International',
    widthIn: 5.83,
    heightIn: 8.27,
    label: '148 × 210 mm',
    description: 'International standard for trade paperbacks',
  },
  a4: {
    name: 'A4 International Document',
    widthIn: 8.27,
    heightIn: 11.69,
    label: '210 × 297 mm',
    description: 'Standard for whitepapers, documentation binders, and reports',
  },
  letter: {
    name: 'US Letter',
    widthIn: 8.5,
    heightIn: 11.0,
    label: '8.5" × 11"',
    description: 'Standard US document and reference binder format',
  },
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', direction: 'ltr' },
  { code: 'es', name: 'Spanish', native: 'Español', direction: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', direction: 'ltr' },
  { code: 'de', name: 'German', native: 'Deutsch', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', direction: 'ltr' },
  { code: 'ja', name: 'Japanese', native: '日本語', direction: 'ltr' },
  { code: 'zh', name: 'Chinese', native: '中文', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', native: 'العربية', direction: 'rtl' },
  { code: 'he', name: 'Hebrew', native: 'עברית', direction: 'rtl' },
  { code: 'pt', name: 'Portuguese', native: 'Português', direction: 'ltr' },
  { code: 'ru', name: 'Russian', native: 'Русский', direction: 'ltr' },
  { code: 'it', name: 'Italian', native: 'Italiano', direction: 'ltr' },
  { code: 'other', name: 'Custom Language', native: 'Any Language', direction: 'ltr' },
]

export function getLanguageDirection(code: string): 'ltr' | 'rtl' {
  if (code === 'ar' || code === 'he' || code === 'fa' || code === 'ur') {
    return 'rtl'
  }
  return 'ltr'
}

export function formatWordCount(count: number): string {
  if (count < 1000) return `${count} words`
  return `${(count / 1000).toFixed(1)}k words`
}

export function generatePrintStylesheet(settings: PrintSettings, bookTitle: string): string {
  const spec = TRIM_SIZE_SPECS[settings.trimSize]
  const fontChoice =
    settings.fontFamily === 'serif'
      ? '"Lora", "Georgia", "Cambria", serif'
      : settings.fontFamily === 'mono'
        ? '"Geist Mono", "Courier New", monospace'
        : '"Geist", -apple-system, sans-serif'

  return `
    @page {
      size: ${spec.widthIn}in ${spec.heightIn}in;
      margin-top: 0.75in;
      margin-bottom: 0.75in;
    }

    @page :left {
      margin-left: ${settings.outerMarginIn}in;
      margin-right: ${settings.gutterMarginIn}in;
      ${
        settings.showPageNumbers
          ? `@bottom-left { content: counter(page); font-family: ${fontChoice}; font-size: 9pt; }`
          : ''
      }
      ${
        settings.runningHeaders
          ? `@top-center { content: "${bookTitle.replace(/"/g, '\\"')}"; font-family: ${fontChoice}; font-size: 8.5pt; font-style: italic; }`
          : ''
      }
    }

    @page :right {
      margin-left: ${settings.gutterMarginIn}in;
      margin-right: ${settings.outerMarginIn}in;
      ${
        settings.showPageNumbers
          ? `@bottom-right { content: counter(page); font-family: ${fontChoice}; font-size: 9pt; }`
          : ''
      }
      ${
        settings.runningHeaders
          ? `@top-center { content: string(chapter-title); font-family: ${fontChoice}; font-size: 8.5pt; font-style: italic; }`
          : ''
      }
    }

    @page :first {
      margin: 1in;
      @bottom-left { content: normal; }
      @bottom-right { content: normal; }
      @top-center { content: normal; }
    }
  `
}
