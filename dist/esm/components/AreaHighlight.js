import React, { useState } from "react";
import { getPageFromElement } from "../lib/pdfjs-dom";
import "../style/AreaHighlight.css";
import { Rnd } from "react-rnd";
/**
 * Renders a resizeable and interactive rectangular area for a highlight.
 *
 * @category Component
 */
export const AreaHighlight = ({ highlight, onChange, isScrolledTo, bounds, onContextMenu, onEditStart, style, showCategoryColor = false, onClick, }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const scrolledToClass = isScrolledTo ? "AreaHighlight--scrolledTo" : "";
    // Only show category class when showCategoryColor is true or is pending multi-selection
    const isPending = highlight.id.startsWith('temp-');
    const categoryClass = (highlight.category && (showCategoryColor || isPending)) ? `AreaHighlight--${highlight.category}` : "";
    // Add subType class for text+code category styling
    const subTypeClass = (highlight.category === "text+code" && highlight.subType) ? `AreaHighlight--${highlight.subType}` : "";
    const highlightClass = `${scrolledToClass} ${categoryClass} ${subTypeClass}`.trim();
    // For test highlights (no category), use direct style manipulation for immediate feedback
    const isTestHighlight = !highlight.category;
    const getTestHighlightStyle = () => {
        if (!isTestHighlight)
            return style;
        const baseStyle = {
            border: '1px solid #ffc107',
            borderRadius: '3px',
            transition: 'background 0.1s ease',
            ...(style || {})
        };
        if (isScrolledTo) {
            return {
                ...baseStyle,
                background: '#ff4141',
                border: '1px solid #dc3545'
            };
        }
        if (isClicked || isHovered) {
            return {
                ...baseStyle,
                background: 'rgba(255, 226, 143, 0.6)',
                border: '1px solid #ffc107'
            };
        }
        return {
            ...baseStyle,
            background: 'rgba(255, 226, 143, 0.3)',
            border: '1px solid #ffc107'
        };
    };
    // Generate key based on position. This forces a remount (and a defaultpos update)
    // whenever highlight position changes (e.g., when updated, scale changes, etc.)
    // We don't use position as state because when updating Rnd this would happen and cause flickering:
    // User moves Rnd -> Rnd records new pos -> Rnd jumps back -> highlight updates -> Rnd re-renders at new pos
    const key = `${highlight.position.boundingRect.width}${highlight.position.boundingRect.height}${highlight.position.boundingRect.left}${highlight.position.boundingRect.top}`;
    return (React.createElement("div", { className: `AreaHighlight ${highlightClass}`, onContextMenu: onContextMenu },
        React.createElement(Rnd, { className: "AreaHighlight__part", onDragStop: (_, data) => {
                const boundingRect = {
                    ...highlight.position.boundingRect,
                    top: data.y,
                    left: data.x,
                };
                onChange && onChange(boundingRect);
            }, onResizeStop: (_mouseEvent, _direction, ref, _delta, position) => {
                const boundingRect = {
                    top: position.y,
                    left: position.x,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    pageNumber: getPageFromElement(ref)?.number || -1,
                };
                onChange && onChange(boundingRect);
            }, onDragStart: onEditStart, onResizeStart: onEditStart, default: {
                x: highlight.position.boundingRect.left,
                y: highlight.position.boundingRect.top,
                width: highlight.position.boundingRect.width,
                height: highlight.position.boundingRect.height,
            }, key: key, bounds: bounds, 
            // Handle clicks for test highlights
            onClick: (event) => {
                if (isTestHighlight) {
                    setIsClicked(true);
                    setTimeout(() => setIsClicked(false), 200);
                    onClick && onClick();
                }
                else {
                    event.stopPropagation();
                    event.preventDefault();
                }
            }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), style: getTestHighlightStyle() })));
};
//# sourceMappingURL=AreaHighlight.js.map