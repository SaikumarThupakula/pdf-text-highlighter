// Utility for programmatically highlighting text from backend data
import { Highlight, ScaledPosition, Content, Scaled } from "../types";

export interface BackendHighlightData {
  text: string;
  pageNumber: number;
  comment?: string;
  category?: string;
  color?: string;
  // Coordinates provided by backend
  coordinates?: {
    boundingRect: Scaled;
    rects: Scaled[];
  };
}

export interface BackendHighlightConfig {
  pdfUrl: string;
  highlights: BackendHighlightData[];
}

/**
 * Utility class for creating highlights from backend data
 */
export class BackendTextHighlighter {
  private static generateId(): string {
    return String(Math.random()).slice(2);
  }

  /**
   * Find text spans in the PDF and create highlights
   */
  static async createHighlightsFromBackendData(
    config: BackendHighlightConfig,
    onHighlightCreated: (highlight: Highlight, comment: string) => void
  ): Promise<void> {
    const { pdfUrl, highlights } = config;

    for (const highlightData of highlights) {
      try {
        await this.createHighlightFromText(
          highlightData,
          onHighlightCreated
        );
      } catch (error) {
        console.error(`Failed to create highlight for text: "${highlightData.text}"`, error);
      }
    }
  }

  /**
   * Create a single highlight from backend data with coordinates
   */
  private static async createHighlightFromText(
    highlightData: BackendHighlightData,
    onHighlightCreated: (highlight: Highlight, comment: string) => void
  ): Promise<void> {
    const { text, pageNumber, comment = "", category, color, coordinates } = highlightData;

    // If coordinates are provided by backend, use them directly
    if (coordinates) {
      const highlight: Highlight = {
        id: this.generateId(),
        content: { text },
        type: "text",
        position: {
          boundingRect: coordinates.boundingRect,
          rects: coordinates.rects
        }
      };

      onHighlightCreated(highlight, comment);
      console.log('✅ Backend highlight created with provided coordinates:', text.substring(0, 50) + '...');
      return;
    }

    // Fallback: Find text spans in the PDF (if coordinates not provided)
    const textSpans = this.findTextSpans(text, pageNumber);
    
    if (textSpans.length === 0) {
      console.warn(`Text not found: "${text}" on page ${pageNumber}`);
      return;
    }

    // Create highlight from spans
    await this.createHighlightFromSpans(
      textSpans,
      text,
      comment,
      category,
      color,
      onHighlightCreated
    );
  }

  /**
   * Find text spans in the PDF document
   */
  private static findTextSpans(searchText: string, pageNumber: number): HTMLElement[] {
    const pageElement = document.querySelector(`[data-page-number="${pageNumber}"]`) ||
                      document.querySelector(`.page[data-page-number="${pageNumber}"]`);
    
    if (!pageElement) {
      console.warn(`Page ${pageNumber} not found`);
      return [];
    }

    // Get all text spans in the page
    const textSpans = pageElement.querySelectorAll('span[role="presentation"]');
    const foundSpans: HTMLElement[] = [];
    
    const searchTextLower = searchText.toLowerCase();
    let currentIndex = 0;
    
    // Search through text spans to find the target text
    for (let i = 0; i < textSpans.length; i++) {
      const span = textSpans[i] as HTMLElement;
      const spanText = span.textContent?.toLowerCase() || '';
      
      if (spanText.includes(searchTextLower)) {
        // Found the text, collect all relevant spans
        const result = this.findTextFromIndex(textSpans, i, searchTextLower);
        if (result.found) {
          for (let j = i; j < i + result.spanCount; j++) {
            foundSpans.push(textSpans[j] as HTMLElement);
          }
          break;
        }
      }
    }

    return foundSpans;
  }

  /**
   * Find text starting from a specific index
   */
  private static findTextFromIndex(
    textSpans: NodeListOf<Element>,
    startIndex: number,
    searchTextLower: string
  ): { found: boolean; spanCount: number } {
    let spanCount = 0;
    let accumulatedText = '';

    for (let i = startIndex; i < textSpans.length && spanCount < 20; i++) {
      const span = textSpans[i] as HTMLElement;
      const spanText = span.textContent?.toLowerCase() || '';
      
      accumulatedText += spanText;
      spanCount++;

      if (accumulatedText.includes(searchTextLower)) {
        return { found: true, spanCount };
      }

      // Stop if we've gone too far without finding the text
      if (accumulatedText.length > searchTextLower.length * 2) {
        break;
      }
    }

    return { found: false, spanCount: 0 };
  }

  /**
   * Create highlight from found text spans
   */
  private static async createHighlightFromSpans(
    spans: HTMLElement[],
    originalText: string,
    comment: string,
    category?: string,
    color?: string,
    onHighlightCreated?: (highlight: Highlight, comment: string) => void
  ): Promise<void> {
    if (spans.length === 0) return;

    try {
      const firstSpan = spans[0];
      const lastSpan = spans[spans.length - 1];

      // Get the page number
      const pageElement = firstSpan.closest('[data-page-number]') || firstSpan.closest('.page');
      const pageNumber = pageElement ?
        parseInt(pageElement.getAttribute('data-page-number') || '1') : 1;

      // Get bounding rectangles
      const firstRect = firstSpan.getBoundingClientRect();
      const lastRect = lastSpan.getBoundingClientRect();

      // Get PDF container for relative positioning
      const pdfContainer = document.querySelector('.react-pdf-highlighter') ||
                          document.querySelector('.pdfViewer') ||
                          document.querySelector('.pdf-viewer');

      if (!pdfContainer) {
        console.error('PDF container not found');
        return;
      }

      const containerRect = pdfContainer.getBoundingClientRect();

      // Calculate positions relative to PDF container
      const x1 = firstRect.left - containerRect.left;
      const y1 = firstRect.top - containerRect.top;
      const x2 = lastRect.right - containerRect.left;
      const y2 = lastRect.bottom - containerRect.top;

      // Create highlight object with proper coordinate structure
      const highlight: Highlight = {
        id: this.generateId(),
        content: {
          text: originalText
        },
        type: "text",
        position: {
          boundingRect: {
            x1: Math.max(0, x1),
            y1: Math.max(0, y1),
            x2: Math.max(x1, x2),
            y2: Math.max(y1, y2),
            width: containerRect.width,
            height: containerRect.height,
            pageNumber
          },
          rects: spans.map(span => {
            const rect = span.getBoundingClientRect();
            return {
              x1: Math.max(0, rect.left - containerRect.left),
              y1: Math.max(0, rect.top - containerRect.top),
              x2: Math.max(rect.left - containerRect.left, rect.right - containerRect.left),
              y2: Math.max(rect.top - containerRect.top, rect.bottom - containerRect.top),
              width: containerRect.width,
              height: containerRect.height,
              pageNumber
            };
          })
        }
      };

      // Add the highlight
      if (onHighlightCreated) {
        onHighlightCreated(highlight, comment);
      }

      console.log('✅ Backend highlight created successfully:', originalText.substring(0, 50) + '...');
    } catch (error) {
      console.error('Failed to create highlight from spans:', error);
    }
  }

  /**
   * Create highlights from backend API response
   */
  static async createHighlightsFromAPI(
    apiUrl: string,
    pdfUrl: string,
    onHighlightCreated: (highlight: Highlight, comment: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      const config: BackendHighlightConfig = {
        pdfUrl,
        highlights: data.highlights || data // Handle different API response formats
      };

      await this.createHighlightsFromBackendData(config, onHighlightCreated);
    } catch (error) {
      console.error('Failed to fetch highlights from API:', error);
    }
  }
}

export default BackendTextHighlighter;
