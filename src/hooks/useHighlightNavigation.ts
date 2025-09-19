import { useState, useCallback, useMemo } from "react";
import type { Highlight, HighlightCategory } from "../types";

/**
 * Interface for navigable highlight item
 */
export interface NavigableHighlight {
  id: string;
  text: string;
  category: HighlightCategory;
  highlight: Highlight;
  index: number;
}

/**
 * Hook for navigating through highlights with arrow controls
 */
export const useHighlightNavigation = (
  extractedTexts: Array<{ id: string; text: string; position: any }> = [],
  extractedCodes: Array<{ id: string; code: string; position: any }> = [],
  onHighlightChange?: (highlight: Highlight | null) => void,
  onScrollToHighlight?: (highlightId: string) => void
) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // Create a combined list of navigable highlights
  const navigableHighlights = useMemo((): NavigableHighlight[] => {
    const highlights: NavigableHighlight[] = [];

    // Add extracted texts
    extractedTexts.forEach((text, index) => {
      highlights.push({
        id: `extracted-text-${text.id}`,
        text: text.text,
        category: "extracted-text",
        highlight: {
          id: `extracted-text-${text.id}`,
          type: "text",
          category: "extracted-text",
          content: { text: text.text },
          position: text.position,
        },
        index: highlights.length,
      });
    });

    // Add extracted codes
    extractedCodes.forEach((code, index) => {
      highlights.push({
        id: `extracted-code-${code.id}`,
        text: code.code,
        category: "extracted-code",
        highlight: {
          id: `extracted-code-${code.id}`,
          type: "text",
          category: "extracted-code",
          content: { text: code.code },
          position: code.position,
        },
        index: highlights.length,
      });
    });

    return highlights;
  }, [extractedTexts, extractedCodes]);

  // Get current highlight
  const currentHighlight = useMemo((): NavigableHighlight | null => {
    if (currentIndex >= 0 && currentIndex < navigableHighlights.length) {
      return navigableHighlights[currentIndex];
    }
    return null;
  }, [navigableHighlights, currentIndex]);

  // Navigate to next highlight
  const navigateNext = useCallback(() => {
    if (navigableHighlights.length === 0) return;
    
    const nextIndex = currentIndex >= navigableHighlights.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
    
    const nextHighlight = navigableHighlights[nextIndex];
    if (nextHighlight) {
      onHighlightChange?.(nextHighlight.highlight);
      onScrollToHighlight?.(nextHighlight.id);
    }
  }, [currentIndex, navigableHighlights, onHighlightChange, onScrollToHighlight]);

  // Navigate to previous highlight
  const navigatePrevious = useCallback(() => {
    if (navigableHighlights.length === 0) return;
    
    const prevIndex = currentIndex <= 0 ? navigableHighlights.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    
    const prevHighlight = navigableHighlights[prevIndex];
    if (prevHighlight) {
      onHighlightChange?.(prevHighlight.highlight);
      onScrollToHighlight?.(prevHighlight.id);
    }
  }, [currentIndex, navigableHighlights, onHighlightChange, onScrollToHighlight]);

  // Navigate to specific highlight by ID
  const navigateToHighlight = useCallback((highlightId: string) => {
    const index = navigableHighlights.findIndex(h => h.id === highlightId);
    if (index >= 0) {
      setCurrentIndex(index);
      const highlight = navigableHighlights[index];
      onHighlightChange?.(highlight.highlight);
      onScrollToHighlight?.(highlight.id);
    }
  }, [navigableHighlights, onHighlightChange, onScrollToHighlight]);

  // Clear navigation
  const clearNavigation = useCallback(() => {
    setCurrentIndex(-1);
    onHighlightChange?.(null);
  }, [onHighlightChange]);

  // Start navigation (go to first item)
  const startNavigation = useCallback(() => {
    if (navigableHighlights.length > 0) {
      setCurrentIndex(0);
      const firstHighlight = navigableHighlights[0];
      onHighlightChange?.(firstHighlight.highlight);
      onScrollToHighlight?.(firstHighlight.id);
    }
  }, [navigableHighlights, onHighlightChange, onScrollToHighlight]);

  // Get navigation info
  const navigationInfo = useMemo(() => {
    return {
      current: currentIndex + 1,
      total: navigableHighlights.length,
      hasNext: navigableHighlights.length > 0 && currentIndex < navigableHighlights.length - 1,
      hasPrevious: navigableHighlights.length > 0 && currentIndex > 0,
      isActive: currentIndex >= 0,
    };
  }, [currentIndex, navigableHighlights.length]);

  // Get highlights by category for display
  const highlightsByCategory = useMemo(() => {
    const byCategory: Record<HighlightCategory, NavigableHighlight[]> = {
      "extracted-text": [],
      "extracted-code": [],
      "ict-code": [],
      "codes": [],
    };

    navigableHighlights.forEach(highlight => {
      if (byCategory[highlight.category]) {
        byCategory[highlight.category].push(highlight);
      }
    });

    return byCategory;
  }, [navigableHighlights]);

  return {
    // Current state
    currentHighlight,
    currentIndex,
    navigableHighlights,
    navigationInfo,
    highlightsByCategory,
    
    // Navigation actions
    navigateNext,
    navigatePrevious,
    navigateToHighlight,
    clearNavigation,
    startNavigation,
    
    // Computed properties
    hasHighlights: navigableHighlights.length > 0,
    totalHighlights: navigableHighlights.length,
  };
};