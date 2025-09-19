import React from "react";
import type { NavigableHighlight } from "../hooks/useHighlightNavigation";
/**
 * Props for the NavigableHighlightSidebar component
 */
export interface NavigableHighlightSidebarProps {
    /**
     * List of navigable highlights
     */
    highlights: NavigableHighlight[];
    /**
     * Highlights grouped by category
     */
    highlightsByCategory: Record<string, NavigableHighlight[]>;
    /**
     * Currently selected highlight
     */
    currentHighlight: NavigableHighlight | null;
    /**
     * Navigation info
     */
    navigationInfo: {
        current: number;
        total: number;
        hasNext: boolean;
        hasPrevious: boolean;
        isActive: boolean;
    };
    /**
     * Navigation callbacks
     */
    onNext: () => void;
    onPrevious: () => void;
    onStart: () => void;
    onClear: () => void;
    onNavigateToHighlight: (id: string) => void;
    /**
     * Delete callback
     */
    onDelete?: (id: string, category: string) => void;
}
/**
 * Sidebar component with navigation controls and highlight list
 */
export declare const NavigableHighlightSidebar: ({ highlights, highlightsByCategory, currentHighlight, navigationInfo, onNext, onPrevious, onStart, onClear, onNavigateToHighlight, onDelete, }: NavigableHighlightSidebarProps) => React.JSX.Element;
