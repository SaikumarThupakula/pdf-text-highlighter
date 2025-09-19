import type { HighlightCategory } from "../types";
/**
 * Color configuration for different highlight categories
 */
export interface HighlightColorConfig {
    background: string;
    backgroundHover: string;
    backgroundScrolledTo: string;
    border?: string;
}
/**
 * Default color configurations for different highlight categories
 */
export declare const HIGHLIGHT_COLORS: Record<HighlightCategory | "default", HighlightColorConfig>;
/**
 * Get color configuration for a highlight category
 */
export declare const getHighlightColors: (category?: HighlightCategory) => HighlightColorConfig;
/**
 * Generate CSS styles for a highlight based on its category and state
 */
export declare const getHighlightStyle: (category?: HighlightCategory, isScrolledTo?: boolean, isHovered?: boolean) => React.CSSProperties;
