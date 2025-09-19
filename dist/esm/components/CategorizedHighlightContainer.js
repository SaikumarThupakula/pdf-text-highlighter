import React, { useEffect, useRef } from "react";
import { useHighlightContainerContext } from "../contexts/HighlightContext";
import { CategorizedTextHighlight } from "./CategorizedTextHighlight";
import { AreaHighlight } from "./AreaHighlight";
/**
 * A highlight container that renders highlights with category-based styling and visibility fixes
 */
export const CategorizedHighlightContainer = ({ onHighlightClick, }) => {
    const { highlight, isScrolledTo, } = useHighlightContainerContext();
    const containerRef = useRef(null);
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
        return (React.createElement("div", { ref: containerRef },
            React.createElement(CategorizedTextHighlight, { highlight: highlight, isScrolledTo: isScrolledTo, onClick: handleClick })));
    }
    else {
        // For area highlights, use the original AreaHighlight component
        return (React.createElement("div", { ref: containerRef },
            React.createElement(AreaHighlight, { highlight: highlight, isScrolledTo: isScrolledTo })));
    }
};
//# sourceMappingURL=CategorizedHighlightContainer.js.map