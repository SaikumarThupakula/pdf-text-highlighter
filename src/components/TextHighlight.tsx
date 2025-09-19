import React, { CSSProperties, MouseEvent } from "react";

import "../style/TextHighlight.css";

import type { ViewportHighlight } from "../types";

/**
 * The props type for {@link TextHighlight}.
 *
 * @category Component Properties
 */
export interface TextHighlightProps {
  /**
   * Highlight to render over text.
   */
  highlight: ViewportHighlight;

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

  /**
   * Whether to show category colors for this highlight.
   */
  showCategoryColor?: boolean;
}

/**
 * A component for displaying a highlighted text area.
 *
 * @category Component
 */
export const TextHighlight = ({
  highlight,
  onClick,
  onMouseOver,
  onMouseOut,
  isScrolledTo,
  onContextMenu,
  style,
  showCategoryColor = false,
}: TextHighlightProps) => {

  const scrolledToClass = isScrolledTo ? "TextHighlight--scrolledTo" : "";
  // Only show category class when showCategoryColor is true or is pending multi-selection
  const isPending = highlight.id.startsWith('temp-');
  const categoryClass = (highlight.category && (showCategoryColor || isPending)) ? `TextHighlight--${highlight.category}` : "";
  const pendingClass = isPending ? "TextHighlight--pending" : "";
  // Add subType class for text+code category styling
  const subTypeClass = (highlight.category === "text+code" && highlight.subType) ? `TextHighlight--${highlight.subType}` : "";
  const highlightClass = `${scrolledToClass} ${categoryClass} ${subTypeClass} ${pendingClass}`.trim();
  const { rects } = highlight.position;

  return (
    <div
      className={`TextHighlight ${highlightClass}`}
      onContextMenu={onContextMenu}
    >
      <div className="TextHighlight__parts">
        {rects.map((rect, index) => (
          <div
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
            key={index}
            style={{ ...rect, ...style }}
            className={`TextHighlight__part`}
          />
        ))}
      </div>
    </div>
  );
};
