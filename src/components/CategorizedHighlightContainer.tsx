import React, { useEffect, useRef } from "react";
import { useHighlightContainerContext } from "../contexts/HighlightContext";
import { CategorizedTextHighlight } from "./CategorizedTextHighlight";
import { AreaHighlight } from "./AreaHighlight";
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
export const CategorizedHighlightContainer = ({
  onHighlightClick,
}: CategorizedHighlightContainerProps) => {
  const {
    highlight,
    isScrolledTo,
  } = useHighlightContainerContext<Highlight & { category?: HighlightCategory }>();
  
  const containerRef = useRef<HTMLDivElement>(null);

  const isTextHighlight = !Boolean(highlight.content && highlight.content.image);

  const handleClick = () => {
    if (onHighlightClick) {
      onHighlightClick(highlight, highlight.category);
    }
  };

  // Force container visibility and positioning
  useEffect(() => {
    if (containerRef.current) {
      // Ensure the container is properly positioned
      const container = containerRef.current;
      container.style.position = "absolute";
      container.style.pointerEvents = "auto";
      container.style.zIndex = "10";
      
      // Force a repaint to ensure visibility
      container.style.display = 'none';
      container.offsetHeight; // Trigger reflow
      container.style.display = '';
    }
  }, [highlight.id, highlight.position]);

  if (isTextHighlight) {
    return (
      <div ref={containerRef}>
        <CategorizedTextHighlight
          highlight={highlight}
          isScrolledTo={isScrolledTo}
          onClick={handleClick}
        />
      </div>
    );
  } else {
    // For area highlights, use the original AreaHighlight component
    return (
      <div ref={containerRef}>
        <AreaHighlight
          highlight={highlight}
          isScrolledTo={isScrolledTo}
        />
      </div>
    );
  }
};