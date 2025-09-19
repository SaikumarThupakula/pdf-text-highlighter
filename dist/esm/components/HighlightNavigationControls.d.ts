import React from "react";
/**
 * Props for the HighlightNavigationControls component
 */
export interface HighlightNavigationControlsProps {
    /**
     * Current highlight number (1-based)
     */
    current: number;
    /**
     * Total number of highlights
     */
    total: number;
    /**
     * Whether there is a next highlight
     */
    hasNext: boolean;
    /**
     * Whether there is a previous highlight
     */
    hasPrevious: boolean;
    /**
     * Whether navigation is currently active
     */
    isActive: boolean;
    /**
     * Current highlight category
     */
    currentCategory?: string;
    /**
     * Callback for next navigation
     */
    onNext: () => void;
    /**
     * Callback for previous navigation
     */
    onPrevious: () => void;
    /**
     * Callback to start navigation
     */
    onStart: () => void;
    /**
     * Callback to clear navigation
     */
    onClear: () => void;
}
/**
 * Navigation controls component with arrow buttons
 */
export declare const HighlightNavigationControls: ({ current, total, hasNext, hasPrevious, isActive, currentCategory, onNext, onPrevious, onStart, onClear, }: HighlightNavigationControlsProps) => React.JSX.Element;
