import React, { CSSProperties, MouseEvent } from "react";
import "../style/TextHighlight.css";
import type { ViewportHighlight, HighlightCategory } from "../types";
/**
 * The props type for {@link CategorizedTextHighlight}.
 *
 * @category Component Properties
 */
export interface CategorizedTextHighlightProps {
    /**
     * Highlight to render over text.
     */
    highlight: ViewportHighlight & {
        category?: HighlightCategory;
    };
    /**
     * Callback triggered whenever the user clicks on the part of a highlight.
     *
     * @param event - Mouse event associated with click.
     */
    onClick?(event: MouseEvent<HTMLDivElement>): void;
    /**
     * Callback triggered whenever the user enters the area of a text highlight.
     *
     * @param event - Mouse event associated with movement.
     */
    onMouseOver?(event: MouseEvent<HTMLDivElement>): void;
    /**
     * Callback triggered whenever the user leaves  the area of a text highlight.
     *
     * @param event - Mouse event associated with movement.
     */
    onMouseOut?(event: MouseEvent<HTMLDivElement>): void;
    /**
     * Indicates whether the component is autoscrolled into view, affecting
     * default theming.
     */
    isScrolledTo: boolean;
    /**
     * Callback triggered whenever the user tries to open context menu on highlight.
     *
     * @param event - Mouse event associated with click.
     */
    onContextMenu?(event: MouseEvent<HTMLDivElement>): void;
    /**
     * Optional CSS styling applied to each TextHighlight part.
     */
    style?: CSSProperties;
}
/**
 * A component for displaying a highlighted text area with category-based coloring and visibility fixes.
 *
 * @category Component
 */
export declare const CategorizedTextHighlight: ({ highlight, onClick, onMouseOver, onMouseOut, isScrolledTo, onContextMenu, style, }: CategorizedTextHighlightProps) => React.JSX.Element | null;
