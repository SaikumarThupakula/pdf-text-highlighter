import React from "react";
import type { Highlight, HighlightCategory } from "../types";
/**
 * Props for the CategorizedHighlightContainer
 */
export interface CategorizedHighlightContainerProps {
    /**
     * Callback when a highlight is clicked
     */
    onHighlightClick?: (highlight: Highlight, category?: HighlightCategory) => void;
}
/**
 * A highlight container that renders highlights with category-based styling and visibility fixes
 */
export declare const CategorizedHighlightContainer: ({ onHighlightClick, }: CategorizedHighlightContainerProps) => React.JSX.Element;
