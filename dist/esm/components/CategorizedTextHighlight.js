import React, { useState, useEffect, useRef } from "react";
import "../style/TextHighlight.css";
import { getHighlightStyle } from "../lib/highlight-colors";
/**
 * A component for displaying a highlighted text area with category-based coloring and visibility fixes.
 *
 * @category Component
 */
export const CategorizedTextHighlight = ({ highlight, onClick, onMouseOver, onMouseOut, isScrolledTo, onContextMenu, style, }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);
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
    const handleMouseOver = (event) => {
        setIsHovered(true);
        onMouseOver?.(event);
    };
    const handleMouseOut = (event) => {
        setIsHovered(false);
        onMouseOut?.(event);
    };
    // Get category-based styling with enhanced visibility
    const categoryStyle = getHighlightStyle(highlight.category, isScrolledTo, isHovered);
    // Enhanced style with visibility fixes
    const enhancedStyle = {
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
    return (React.createElement("div", { ref: containerRef, className: `TextHighlight ${highlightClass}`, onContextMenu: onContextMenu, style: { position: "absolute" } },
        React.createElement("div", { className: "TextHighlight__parts" }, rects.map((rect, index) => (React.createElement("div", { onMouseOver: handleMouseOver, onMouseOut: handleMouseOut, onClick: onClick, key: `${highlight.id}-${index}`, style: {
                ...rect,
                ...enhancedStyle,
                ...style,
                // Override background if not using category colors
                ...(style?.background && { background: style.background }),
                // Ensure minimum dimensions for visibility
                minWidth: "2px",
                minHeight: "2px",
            }, className: `TextHighlight__part`, "data-highlight-id": highlight.id, "data-highlight-category": highlight.category }))))));
};
//# sourceMappingURL=CategorizedTextHighlight.js.map