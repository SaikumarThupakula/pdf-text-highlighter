import React, { useState } from "react";
import "../style/TextHighlight.css";
/**
 * A component for displaying a highlighted text area.
 *
 * @category Component
 */
export const TextHighlight = ({ highlight, onClick, onMouseOver, onMouseOut, isScrolledTo, onContextMenu, style, showCategoryColor = false, }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const scrolledToClass = isScrolledTo ? "TextHighlight--scrolledTo" : "";
    // Only show category class when showCategoryColor is true or is pending multi-selection
    const isPending = highlight.id.startsWith('temp-');
    const categoryClass = (highlight.category && (showCategoryColor || isPending)) ? `TextHighlight--${highlight.category}` : "";
    const pendingClass = isPending ? "TextHighlight--pending" : "";
    // Add subType class for text+code category styling
    const subTypeClass = (highlight.category === "text+code" && highlight.subType) ? `TextHighlight--${highlight.subType}` : "";
    const highlightClass = `${scrolledToClass} ${categoryClass} ${subTypeClass} ${pendingClass}`.trim();
    const { rects } = highlight.position;
    // For test highlights (no category), use direct style manipulation for immediate feedback
    const isTestHighlight = !highlight.category;
    const getTestHighlightStyle = (baseStyle = {}) => {
        if (!isTestHighlight)
            return baseStyle;
        if (isScrolledTo) {
            return {
                ...baseStyle,
                background: '#ff4141',
                transition: 'background 0.1s ease'
            };
        }
        if (isClicked || isHovered) {
            return {
                ...baseStyle,
                background: 'rgba(255, 226, 143, 0.6)',
                transition: 'background 0.1s ease'
            };
        }
        return {
            ...baseStyle,
            background: 'rgba(255, 226, 143, 0.3)',
            transition: 'background 0.1s ease'
        };
    };
    const handleMouseOver = (event) => {
        setIsHovered(true);
        onMouseOver && onMouseOver(event);
    };
    const handleMouseOut = (event) => {
        setIsHovered(false);
        onMouseOut && onMouseOut(event);
    };
    const handleClick = (event) => {
        if (isTestHighlight) {
            setIsClicked(true);
            // Keep clicked state for a short time to provide immediate visual feedback
            setTimeout(() => setIsClicked(false), 200);
        }
        onClick && onClick(event);
    };
    return (React.createElement("div", { className: `TextHighlight ${highlightClass}`, onContextMenu: onContextMenu },
        React.createElement("div", { className: "TextHighlight__parts" }, rects.map((rect, index) => (React.createElement("div", { onMouseOver: handleMouseOver, onMouseOut: handleMouseOut, onClick: handleClick, key: index, style: getTestHighlightStyle({ ...rect, ...style }), className: `TextHighlight__part` }))))));
};
//# sourceMappingURL=TextHighlight.js.map