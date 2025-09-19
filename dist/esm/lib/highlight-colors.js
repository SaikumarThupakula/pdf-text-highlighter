/**
 * Default color configurations for different highlight categories
 */
export const HIGHLIGHT_COLORS = {
    "extracted-text": {
        background: "rgba(255, 0, 0, 0.3)", // Red with transparency
        backgroundHover: "rgba(255, 0, 0, 0.5)",
        backgroundScrolledTo: "#ff4141",
        border: "#ff0000",
    },
    "extracted-code": {
        background: "rgba(138, 43, 226, 0.3)", // Purple with transparency
        backgroundHover: "rgba(138, 43, 226, 0.5)",
        backgroundScrolledTo: "#8a2be2",
        border: "#8a2be2",
    },
    "ict-code": {
        background: "rgba(0, 123, 255, 0.3)", // Blue with transparency
        backgroundHover: "rgba(0, 123, 255, 0.5)",
        backgroundScrolledTo: "#007bff",
        border: "#007bff",
    },
    "text+code": {
        background: "rgba(128, 128, 128, 0.3)", // Gray with transparency (default for text+code group)
        backgroundHover: "rgba(128, 128, 128, 0.5)",
        backgroundScrolledTo: "#808080",
        border: "#808080",
    },
    "codes": {
        background: "rgba(40, 167, 69, 0.3)", // Green with transparency
        backgroundHover: "rgba(40, 167, 69, 0.5)",
        backgroundScrolledTo: "#28a745",
        border: "#28a745",
    },
    "default": {
        background: "rgba(255, 226, 143, 0.3)", // Original yellow
        backgroundHover: "rgba(255, 226, 143, 0.5)",
        backgroundScrolledTo: "#ff4141",
        border: "#ffc107",
    },
};
/**
 * Get color configuration for a highlight category
 */
export const getHighlightColors = (category) => {
    return HIGHLIGHT_COLORS[category || "default"];
};
/**
 * Generate CSS styles for a highlight based on its category and state
 */
export const getHighlightStyle = (category, isScrolledTo = false, isHovered = false) => {
    const colors = getHighlightColors(category);
    let background = colors.background;
    if (isScrolledTo) {
        background = colors.backgroundScrolledTo;
    }
    else if (isHovered) {
        background = colors.backgroundHover;
    }
    return {
        background,
        border: colors.border ? `1px solid ${colors.border}` : undefined,
        // Force visibility and positioning
        position: "absolute",
        pointerEvents: "auto",
        zIndex: 1,
    };
};
//# sourceMappingURL=highlight-colors.js.map