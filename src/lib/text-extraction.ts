import { PDFViewer } from "pdfjs-dist/types/web/pdf_viewer";
import type { LTWHP, ViewportPosition } from "../types";

/**
 * Extract text content from a PDF selection area
 */
export const extractTextFromSelection = async (
  viewportPosition: ViewportPosition,
  viewer: PDFViewer
): Promise<string> => {
  try {
    const { boundingRect } = viewportPosition;
    const pageNumber = boundingRect.pageNumber;

    console.log('Extracting text from selection:', {
      pageNumber,
      bounds: boundingRect,
      area: boundingRect.width * boundingRect.height
    });

    // Get the PDF page
    const pageView = viewer.getPageView(pageNumber - 1);
    if (!pageView || !pageView.pdfPage) {
      console.warn('Page not available for text extraction');
      return getFallbackText();
    }

    // Get text content from the page
    const textContent = await pageView.pdfPage.getTextContent();
    console.log('Total text items on page:', textContent.items.length);

    // Try different coordinate transformations since PDF and viewport coordinates might differ
    const attempts = [
      boundingRect, // Original bounds
      shrinkBounds(boundingRect, 0.95), // Slightly smaller bounds (95%)
      transformBounds(boundingRect, pageView.viewport), // Transformed bounds
      shrinkBounds(boundingRect, 0.9), // Smaller bounds (90%)
      shrinkBounds(boundingRect, 0.85), // Even smaller bounds (85%)
    ];

    for (let i = 0; i < attempts.length; i++) {
      const selectedText = extractTextFromBounds(textContent.items, attempts[i]);

      if (selectedText.trim()) {
        console.log(`Text extraction succeeded with attempt ${i + 1}:`, {
          bounds: attempts[i],
          textLength: selectedText.length,
          preview: selectedText.substring(0, 100) + (selectedText.length > 100 ? '...' : '')
        });
        return selectedText.trim();
      }
    }

    // If no text was extracted with any bounds, try fallback methods
    console.warn('No text extracted with any bounds method, trying fallbacks');
    return tryFallbackExtractions(textContent.items, boundingRect);

  } catch (error) {
    console.error('Error extracting text from selection:', error);
    return getFallbackText();
  }
};

/**
 * Transform bounds using viewport transformation
 */
const transformBounds = (bounds: LTWHP, viewport: any): LTWHP => {
  // If viewport has a transform, apply it
  if (viewport && viewport.transform) {
    const [a, b, c, d, e, f] = viewport.transform;

    return {
      ...bounds,
      left: bounds.left * a + e,
      top: bounds.top * d + f,
      width: bounds.width * a,
      height: bounds.height * d,
    };
  }
  return bounds;
};

/**
 * Shrink bounds by a factor to be more conservative
 */
const shrinkBounds = (bounds: LTWHP, factor: number): LTWHP => {
  const shrinkX = bounds.width * (1 - factor) / 2;
  const shrinkY = bounds.height * (1 - factor) / 2;

  return {
    ...bounds,
    left: bounds.left + shrinkX,
    top: bounds.top + shrinkY,
    width: bounds.width * factor,
    height: bounds.height * factor,
  };
};

/**
 * Extract text items that fall within the specified bounds
 */
const extractTextFromBounds = (textItems: any[], bounds: LTWHP): string => {
  const selectedTextItems: Array<{ str: string; x: number; y: number; width: number; height: number }> = [];

  textItems.forEach((item: any) => {
    if (item.str && item.transform) {
      // Get text position from PDF.js transform matrix
      const x = item.transform[4];
      const y = item.transform[5];

      // Get dimensions, with fallback values
      const itemWidth = item.width || (item.str.length * 8); // Approximate character width
      const itemHeight = item.height || 12; // Approximate line height

      // Use stricter bounds checking - require significant overlap
      const itemCenterX = x + itemWidth / 2;
      const itemCenterY = y + itemHeight / 2;
      const itemRight = x + itemWidth;
      const itemBottom = y + itemHeight;

      const boundsRight = bounds.left + bounds.width;
      const boundsBottom = bounds.top + bounds.height;

      // More balanced matching: center point OR meaningful overlap (at least 30% of the text item)
      const centerInBounds = (itemCenterX >= bounds.left && itemCenterX <= boundsRight &&
                             itemCenterY >= bounds.top && itemCenterY <= boundsBottom);

      const overlapX = Math.max(0, Math.min(itemRight, boundsRight) - Math.max(x, bounds.left));
      const overlapY = Math.max(0, Math.min(itemBottom, boundsBottom) - Math.max(y, bounds.top));
      const overlapArea = overlapX * overlapY;
      const itemArea = itemWidth * itemHeight;
      const overlapRatio = itemArea > 0 ? overlapArea / itemArea : 0;

      const meaningfulOverlap = overlapRatio >= 0.3; // At least 30% overlap

      // Also check if any part of the text item intersects with the bounds
      const hasIntersection = overlapX > 0 && overlapY > 0;

      console.log('Text item analysis:', {
        str: item.str,
        position: { x, y, right: itemRight, bottom: itemBottom },
        bounds: { left: bounds.left, top: bounds.top, right: boundsRight, bottom: boundsBottom },
        centerInBounds,
        overlapRatio: overlapRatio.toFixed(3),
        meaningfulOverlap,
        hasIntersection,
        accepted: centerInBounds || meaningfulOverlap || (hasIntersection && overlapRatio >= 0.1)
      });

      if (centerInBounds || meaningfulOverlap || (hasIntersection && overlapRatio >= 0.1)) {
        // Filter out very small text items and standalone punctuation
        const text = item.str.trim();
        if (text.length > 0 && !(text.length === 1 && /^[^\w\s]$/.test(text))) {
          selectedTextItems.push({
            str: item.str,
            x: x,
            y: y,
            width: itemWidth,
            height: itemHeight
          });
        }
      }
    }
  });

  if (selectedTextItems.length === 0) {
    return '';
  }

  // Sort by vertical position (top to bottom), then horizontal (left to right)
  selectedTextItems.sort((a, b) => {
    const yDiff = b.y - a.y; // PDF coordinates are bottom-up
    if (Math.abs(yDiff) > 8) { // Same line threshold - increased for better line detection
      return yDiff;
    }
    return a.x - b.x;
  });

  // Group items by lines and clean up text
  const lines: string[] = [];
  let currentLine: Array<{ str: string; x: number }> = [];
  let currentY = selectedTextItems[0]?.y;

  selectedTextItems.forEach((item) => {
    const yDiff = Math.abs(item.y - currentY);
    if (yDiff > 8) {
      // New line detected - process current line
      if (currentLine.length > 0) {
        lines.push(processTextLine(currentLine));
        currentLine = [];
      }
      currentY = item.y;
    }
    currentLine.push({ str: item.str, x: item.x });
  });

  // Process the last line
  if (currentLine.length > 0) {
    lines.push(processTextLine(currentLine));
  }

  // Join lines and clean up the result
  let result = lines.join('\n').trim();

  // Clean up common artifacts
  result = result
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/^\s*[^\w\s]*\s*/gm, '') // Remove lines that start with only punctuation
    .replace(/\s*[^\w\s]*\s*$/gm, '') // Remove trailing punctuation-only content
    .trim();

  return result;
};

/**
 * Process a line of text items to create clean text
 */
const processTextLine = (lineItems: Array<{ str: string; x: number }>): string => {
  if (lineItems.length === 0) return '';

  // Sort by x position
  lineItems.sort((a, b) => a.x - b.x);

  let lineText = '';
  let lastX = -1;

  lineItems.forEach((item, index) => {
    const text = item.str.trim();
    if (!text) return;

    if (index === 0) {
      lineText = text;
      lastX = item.x;
      return;
    }

    // Determine if we need a space based on position gap
    const gap = item.x - lastX;
    const needsSpace = gap > 10 && // Reasonable gap
                       !lineText.endsWith(' ') &&
                       !text.startsWith(' ') &&
                       !text.match(/^[.,;:!?]/) && // Don't add space before punctuation
                       !lineText.match(/[-—]$/); // Don't add space after hyphens

    if (needsSpace) {
      lineText += ' ';
    }

    lineText += text;
    lastX = item.x;
  });

  return lineText.trim();
};

/**
 * Alternative method: Extract text using browser selection API
 * This works when the user actually selects text in the browser
 */
export const extractTextFromBrowserSelection = (): string => {
  try {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const text = selection.toString().trim();
      if (text) {
        console.log('Browser selection text found:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
        return text;
      }
    }
    return '';
  } catch (error) {
    console.error('Error extracting text from browser selection:', error);
    return '';
  }
};

/**
 * Try to create a selection programmatically and extract text
 */
export const extractTextWithProgrammaticSelection = (bounds: LTWHP, pageElement: HTMLElement): string => {
  try {
    // Find all text nodes within the page element
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      pageElement,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while (node = walker.nextNode()) {
      const textNode = node as Text;
      if (textNode.textContent && textNode.textContent.trim()) {
        textNodes.push(textNode);
      }
    }

    // Find text nodes that fall within the selection bounds
    const selectedNodes: { node: Text, range: Range }[] = [];

    textNodes.forEach(textNode => {
      const range = document.createRange();
      range.selectNodeContents(textNode);
      const rect = range.getBoundingClientRect();
      const pageRect = pageElement.getBoundingClientRect();

      // Convert to page-relative coordinates
      const relativeRect = {
        left: rect.left - pageRect.left,
        top: rect.top - pageRect.top,
        right: rect.right - pageRect.left,
        bottom: rect.bottom - pageRect.top
      };

      // Check if text node overlaps with selection bounds
      const boundsRight = bounds.left + bounds.width;
      const boundsBottom = bounds.top + bounds.height;

      const overlapsHorizontally = relativeRect.left < boundsRight && relativeRect.right > bounds.left;
      const overlapsVertically = relativeRect.top < boundsBottom && relativeRect.bottom > bounds.top;

      if (overlapsHorizontally && overlapsVertically) {
        selectedNodes.push({ node: textNode, range });
      }
    });

    if (selectedNodes.length > 0) {
      const selectedText = selectedNodes.map(({ node }) => node.textContent || '').join(' ').trim();
      if (selectedText) {
        console.log('Programmatic selection text found:', selectedText.substring(0, 100) + (selectedText.length > 100 ? '...' : ''));
        return selectedText;
      }
    }

    return '';
  } catch (error) {
    console.error('Error with programmatic selection:', error);
    return '';
  }
};

/**
 * Try alternative text extraction methods when the primary method fails
 */
const tryFallbackExtractions = (textItems: any[], bounds: LTWHP): string => {
  console.log('Trying fallback extraction methods');

  // Fallback 0: Try browser selection first (most accurate if available)
  const browserSelection = extractTextFromBrowserSelection();
  if (browserSelection.trim()) {
    console.log('Fallback 0 (browser selection) succeeded');
    return browserSelection.trim();
  }

  // Fallback 1: Try programmatic DOM selection
  try {
    const pageElement = document.querySelector('.page') as HTMLElement;
    if (pageElement) {
      const domSelection = extractTextWithProgrammaticSelection(bounds, pageElement);
      if (domSelection.trim()) {
        console.log('Fallback 1 (programmatic DOM selection) succeeded');
        return domSelection.trim();
      }
    }
  } catch (error) {
    console.warn('Fallback 1 (programmatic DOM selection) failed:', error);
  }

  // Fallback 2: Use more generous bounds (expand by 20%)
  const expandedBounds = {
    ...bounds,
    left: bounds.left - bounds.width * 0.1,
    top: bounds.top - bounds.height * 0.1,
    width: bounds.width * 1.2,
    height: bounds.height * 1.2
  };

  const expandedResult = extractTextFromBoundsLoose(textItems, expandedBounds);
  if (expandedResult.trim()) {
    console.log('Fallback 2 (expanded bounds) succeeded');
    return expandedResult.trim();
  }

  // Fallback 3: Get text items that are even partially within bounds
  const partialResult = extractTextFromBoundsPartial(textItems, bounds);
  if (partialResult.trim()) {
    console.log('Fallback 3 (partial overlap) succeeded');
    return partialResult.trim();
  }

  console.warn('All fallback methods failed');
  return getFallbackText();
};

/**
 * More generous text extraction - checks if text center point is within bounds
 */
const extractTextFromBoundsLoose = (textItems: any[], bounds: LTWHP): string => {
  const selectedTextItems: Array<{ str: string; x: number; y: number }> = [];

  textItems.forEach((item: any) => {
    if (item.str && item.transform) {
      const x = item.transform[4];
      const y = item.transform[5];
      const width = item.width || 10; // Default width if not available
      const height = item.height || 10; // Default height if not available

      // Check if center point of text is within bounds
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      if (centerX >= bounds.left && centerX <= bounds.left + bounds.width &&
          centerY >= bounds.top && centerY <= bounds.top + bounds.height) {
        selectedTextItems.push({
          str: item.str,
          x: x,
          y: y
        });
      }
    }
  });

  return processTextItems(selectedTextItems);
};

/**
 * Extract text that has any overlap with the bounds
 */
const extractTextFromBoundsPartial = (textItems: any[], bounds: LTWHP): string => {
  const selectedTextItems: Array<{ str: string; x: number; y: number }> = [];

  textItems.forEach((item: any) => {
    if (item.str && item.transform) {
      const x = item.transform[4];
      const y = item.transform[5];

      // Very loose check - just needs to be in the general area
      const margin = 50; // 50 pixel margin
      if (x >= bounds.left - margin && x <= bounds.left + bounds.width + margin &&
          y >= bounds.top - margin && y <= bounds.top + bounds.height + margin) {
        selectedTextItems.push({
          str: item.str,
          x: x,
          y: y
        });
      }
    }
  });

  return processTextItems(selectedTextItems);
};

/**
 * Process text items into readable text
 */
const processTextItems = (textItems: Array<{ str: string; x: number; y: number }>): string => {
  if (textItems.length === 0) return '';

  // Sort by position
  textItems.sort((a, b) => {
    const yDiff = b.y - a.y; // PDF coordinates are bottom-up
    if (Math.abs(yDiff) > 10) {
      return yDiff;
    }
    return a.x - b.x;
  });

  // Join text with appropriate spacing
  let result = '';
  textItems.forEach((item, index) => {
    if (index === 0) {
      result = item.str;
    } else {
      // Add space if needed
      if (!result.endsWith(' ') && !item.str.startsWith(' ')) {
        result += ' ';
      }
      result += item.str;
    }
  });

  return result.trim();
};

/**
 * Get fallback text when all extraction methods fail
 */
const getFallbackText = (): string => {
  // Try browser selection one more time
  const browserText = extractTextFromBrowserSelection();
  if (browserText.trim()) {
    return browserText;
  }

  // Return a placeholder to indicate that selection was made but text extraction failed
  return '[Selected content - text extraction unavailable]';
};

/**
 * Extract text from multiple rectangles (for multi-page selections)
 */
export const extractTextFromMultipleRects = async (
  rects: LTWHP[],
  viewer: PDFViewer
): Promise<string> => {
  try {
    const textPromises = rects.map(async (rect) => {
      const viewportPosition: ViewportPosition = {
        boundingRect: rect,
        rects: [rect]
      };
      return extractTextFromSelection(viewportPosition, viewer);
    });

    const textResults = await Promise.all(textPromises);
    const validResults = textResults.filter(text => text.length > 0 && text !== '[Selected content - text extraction unavailable]');

    if (validResults.length === 0) {
      return getFallbackText();
    }

    return validResults.join('\n\n');
  } catch (error) {
    console.error('Error extracting text from multiple rects:', error);
    return getFallbackText();
  }
};