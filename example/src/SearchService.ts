import { PDFDocumentProxy } from "pdfjs-dist";
import { SearchResult } from "./SearchBar";

export interface SearchMatch {
  text: string;
  pageNumber: number;
  textIndex: number;
  startOffset: number;
  endOffset: number;
  boundingRects: Array<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>;
  scaledRects: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    pageNumber: number;
  }>;
}

export class SearchService {
  private pdfDocument: PDFDocumentProxy | null = null;
  private textContentCache: Map<number, string> = new Map();
  private pageTextItemsCache: Map<number, Array<any>> = new Map();

  constructor(pdfDocument: PDFDocumentProxy) {
    this.pdfDocument = pdfDocument;
  }

  async searchText(query: string): Promise<SearchResult[]> {
    if (!this.pdfDocument || !query.trim()) {
      return [];
    }

    const results: SearchResult[] = [];
    const normalizedQuery = query.toLowerCase();

    for (let pageNum = 1; pageNum <= this.pdfDocument.numPages; pageNum++) {
      try {
        const pageResults = await this.searchInPage(pageNum, normalizedQuery);
        results.push(...pageResults);
      } catch (error) {
        console.warn(`Error searching page ${pageNum}:`, error);
      }
    }

    return results;
  }

  private async searchInPage(pageNumber: number, query: string): Promise<SearchResult[]> {
    if (!this.pdfDocument) return [];

    const page = await this.pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.0 });

    // Get text content with positioning information
    const textContent = await page.getTextContent();

    // Cache the text items for this page
    this.pageTextItemsCache.set(pageNumber, textContent.items);

    // Build full text string and track character positions
    let fullText = '';
    const charToItemMap: Array<{ itemIndex: number; charIndex: number }> = [];

    textContent.items.forEach((item: any, itemIndex: number) => {
      if (item.str) {
        fullText += item.str;

        // Map each character to its text item
        for (let i = 0; i < item.str.length; i++) {
          charToItemMap.push({ itemIndex, charIndex: i });
        }

        // Add space between items if needed
        if (itemIndex < textContent.items.length - 1) {
          fullText += ' ';
          charToItemMap.push({ itemIndex: -1, charIndex: -1 }); // Space marker
        }
      }
    });

    // Cache the full text
    this.textContentCache.set(pageNumber, fullText);

    const results: SearchResult[] = [];
    const normalizedText = fullText.toLowerCase();
    let searchIndex = 0;
    let matchCount = 0;

    while (true) {
      const matchIndex = normalizedText.indexOf(query, searchIndex);
      if (matchIndex === -1) break;

      const matchEndIndex = matchIndex + query.length;

      // Find the text items that contain this match
      const startMapping = charToItemMap[matchIndex];
      const endMapping = charToItemMap[matchEndIndex - 1];

      if (startMapping && endMapping && startMapping.itemIndex >= 0 && endMapping.itemIndex >= 0) {
        const { viewportRects, scaledRects } = this.calculateBoundingRects(
          textContent.items,
          startMapping.itemIndex,
          endMapping.itemIndex,
          startMapping.charIndex,
          endMapping.charIndex + 1,
          viewport,
          pageNumber
        );

        if (viewportRects.length > 0) {
          const searchResult: SearchResult = {
            id: `search-${pageNumber}-${matchCount}`,
            text: fullText.substring(matchIndex, matchEndIndex),
            pageNumber,
            position: {
              boundingRect: this.getBoundingRect(viewportRects, pageNumber),
              rects: viewportRects.map(rect => ({ ...rect, pageNumber }))
            },
            scaledPosition: {
              boundingRect: this.getScaledBoundingRect(scaledRects, pageNumber),
              rects: scaledRects,
              usePdfCoordinates: false
            },
            matchIndex: results.length
          };

          results.push(searchResult);
          matchCount++;
        }
      }

      searchIndex = matchIndex + 1;
    }

    return results;
  }

  private calculateBoundingRects(
    textItems: any[],
    startItemIndex: number,
    endItemIndex: number,
    startCharIndex: number,
    endCharIndex: number,
    viewport: any,
    pageNumber: number
  ): {
    viewportRects: Array<{ left: number; top: number; width: number; height: number }>;
    scaledRects: Array<{ x1: number; y1: number; x2: number; y2: number; width: number; height: number; pageNumber: number }>;
  } {
    const viewportRects: Array<{ left: number; top: number; width: number; height: number }> = [];
    const scaledRects: Array<{ x1: number; y1: number; x2: number; y2: number; width: number; height: number; pageNumber: number }> = [];

    for (let itemIndex = startItemIndex; itemIndex <= endItemIndex; itemIndex++) {
      const item = textItems[itemIndex];
      if (!item || !item.str) continue;

      const transform = item.transform;
      const [scaleX, , , , x, y] = transform;

      // Calculate character positions within this text item
      const startChar = itemIndex === startItemIndex ? startCharIndex : 0;
      const endChar = itemIndex === endItemIndex ? Math.min(endCharIndex, item.str.length) : item.str.length;

      if (startChar >= endChar) continue;

      // Estimate character width (simplified approach)
      const charWidth = item.width / item.str.length;
      const left = x + (startChar * charWidth * scaleX);
      const width = (endChar - startChar) * charWidth * Math.abs(scaleX);

      // Convert PDF coordinates to viewport coordinates
      const [viewportX, viewportY] = viewport.convertToViewportPoint(left, y);
      const [, viewportY2] = viewport.convertToViewportPoint(left, y + item.height);

      const viewportRect = {
        left: viewportX,
        top: Math.min(viewportY, viewportY2),
        width: width,
        height: Math.abs(viewportY2 - viewportY)
      };
      viewportRects.push(viewportRect);

      // Calculate scaled coordinates (using page dimensions for width/height)
      const pageWidth = viewport.width;
      const pageHeight = viewport.height;

      const scaledRect = {
        x1: viewportX,
        y1: Math.min(viewportY, viewportY2),
        x2: viewportX + width,
        y2: Math.min(viewportY, viewportY2) + Math.abs(viewportY2 - viewportY),
        width: pageWidth,  // Page width, not highlight width
        height: pageHeight, // Page height, not highlight height
        pageNumber: pageNumber
      };
      scaledRects.push(scaledRect);
    }

    return { viewportRects, scaledRects };
  }

  private getBoundingRect(
    rects: Array<{ left: number; top: number; width: number; height: number }>,
    pageNumber: number
  ) {
    if (rects.length === 0) {
      return { left: 0, top: 0, width: 0, height: 0, pageNumber };
    }

    const left = Math.min(...rects.map(r => r.left));
    const top = Math.min(...rects.map(r => r.top));
    const right = Math.max(...rects.map(r => r.left + r.width));
    const bottom = Math.max(...rects.map(r => r.top + r.height));

    return {
      left,
      top,
      width: right - left,
      height: bottom - top,
      pageNumber
    };
  }

  private getScaledBoundingRect(
    rects: Array<{ x1: number; y1: number; x2: number; y2: number; width: number; height: number; pageNumber: number }>,
    pageNumber: number
  ) {
    if (rects.length === 0) {
      return { x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0, pageNumber };
    }

    const x1 = Math.min(...rects.map(r => r.x1));
    const y1 = Math.min(...rects.map(r => r.y1));
    const x2 = Math.max(...rects.map(r => r.x2));
    const y2 = Math.max(...rects.map(r => r.y2));

    // Use page dimensions from the first rect (all should have same page dimensions)
    const pageWidth = rects[0].width;
    const pageHeight = rects[0].height;

    return {
      x1,
      y1,
      x2,
      y2,
      width: pageWidth,  // Page width, not bounding box width
      height: pageHeight, // Page height, not bounding box height
      pageNumber
    };
  }

  // Get cached text for a page (useful for debugging)
  getPageText(pageNumber: number): string | undefined {
    return this.textContentCache.get(pageNumber);
  }

  // Clear caches when switching documents
  clearCache(): void {
    this.textContentCache.clear();
    this.pageTextItemsCache.clear();
  }

  // Update PDF document reference
  updateDocument(pdfDocument: PDFDocumentProxy): void {
    this.pdfDocument = pdfDocument;
    this.clearCache();
  }
}