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
export declare const useHighlightNavigation: (extractedTexts?: Array<{
    id: string;
    text: string;
    position: any;
}>, extractedCodes?: Array<{
    id: string;
    code: string;
    position: any;
}>, onHighlightChange?: (highlight: Highlight | null) => void, onScrollToHighlight?: (highlightId: string) => void) => {
    currentHighlight: NavigableHighlight | null;
    currentIndex: number;
    navigableHighlights: NavigableHighlight[];
    navigationInfo: {
        current: number;
        total: number;
        hasNext: boolean;
        hasPrevious: boolean;
        isActive: boolean;
    };
    highlightsByCategory: Record<HighlightCategory, NavigableHighlight[]>;
    navigateNext: () => void;
    navigatePrevious: () => void;
    navigateToHighlight: (highlightId: string) => void;
    clearNavigation: () => void;
    startNavigation: () => void;
    hasHighlights: boolean;
    totalHighlights: number;
};
