import React, { CSSProperties, MouseEvent, useState, useEffect, useRef } from "react";

import "../style/TextHighlight.css";

import type { ViewportHighlight, HighlightCategory } from "../types";
import { getHighlightStyle } from "../lib/highlight-colors";

/**
 * The props type for {@link CategorizedTextHighlight}.
 *
 * @category Component Properties
 */
export interface CategorizedTextHighlightProps {
  /**
   * Highlight to render over text.
   */
  highlight: ViewportHighlight & { category?: HighlightCategory };

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
export const CategorizedTextHighlight = ({
  highlight,
  onClick,
  onMouseOver,
  onMouseOut,
  isScrolledTo,
  onContextMenu,
  style,
}: CategorizedTextHighlightProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightClass = isScrolledTo ? "TextHighlight--scrolledTo" : "";
  const { rects } = highlight.position;

  // Force visibility after component mounts and when position changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Force a repaint to ensure visibility
      if (containerRef.current) {
        containerRef.current.style.display = 'none';
        containerRef.current.offsetHeight; // Trigger reflow
        containerRef.current.style.display = '';
      }
    }, 50); // Small delay to ensure PDF is rendered

    return () => clearTimeout(timer);
  }, [highlight.position, highlight.id]);

  const handleMouseOver = (event: MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    onMouseOver?.(event);
  };

  const handleMouseOut = (event: MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    onMouseOut?.(event);
  };

  // Get category-based styling with enhanced visibility
  const categoryStyle = getHighlightStyle(highlight.category, isScrolledTo, isHovered);

  // Enhanced style with visibility fixes
  const enhancedStyle: CSSProperties = {
    ...categoryStyle,
    // Force visibility
    opacity: isVisible ? 1 : 0,
    transition: "opacity 0.2s ease-in-out",
    // Ensure proper layering
    zIndex: 10,
    // Force hardware acceleration for better rendering
    transform: "translateZ(0)",
    willChange: "opacity",
  };

  if (!isVisible) {
    return null; // Don't render until ready
  }

  return (
    <div
      ref={containerRef}
      className={`TextHighlight ${highlightClass}`}
      onContextMenu={onContextMenu}
      style={{ position: "absolute" }}
    >
      <div className="TextHighlight__parts">
        {rects.map((rect, index) => (
          <div
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={onClick}
            key={`${highlight.id}-${index}`} // More specific key
            style={{ 
              ...rect, 
              ...enhancedStyle,
              ...style,
              // Override background if not using category colors
              ...(style?.background && { background: style.background }),
              // Ensure minimum dimensions for visibility
              minWidth: "2px",
              minHeight: "2px",
            }}
            className={`TextHighlight__part`}
            data-highlight-id={highlight.id}
            data-highlight-category={highlight.category}
          />
        ))}
      </div>
    </div>
  );
};