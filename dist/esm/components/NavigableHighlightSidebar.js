import React, { useEffect } from "react";
import { HighlightNavigationControls } from "./HighlightNavigationControls";
/**
 * Sidebar component with navigation controls and highlight list
 */
export const NavigableHighlightSidebar = ({ highlights, highlightsByCategory, currentHighlight, navigationInfo, onNext, onPrevious, onStart, onClear, onNavigateToHighlight, onDelete, }) => {
    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!navigationInfo.isActive)
                return;
            if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                onPrevious();
            }
            else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                onNext();
            }
            else if (event.key === "Escape") {
                event.preventDefault();
                onClear();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [navigationInfo.isActive, onNext, onPrevious, onClear]);
    const formatText = (text, maxLength = 80) => {
        if (text.length <= maxLength)
            return text;
        return text.substring(0, maxLength) + "...";
    };
    const getCategoryColor = (category) => {
        switch (category) {
            case "extracted-text": return "rgba(255, 0, 0, 0.1)";
            case "extracted-code": return "rgba(138, 43, 226, 0.1)";
            case "ict-code": return "rgba(0, 123, 255, 0.1)";
            case "codes": return "rgba(40, 167, 69, 0.1)";
            default: return "rgba(108, 117, 125, 0.1)";
        }
    };
    const getCategoryBorder = (category) => {
        switch (category) {
            case "extracted-text": return "#ff0000";
            case "extracted-code": return "#8a2be2";
            case "ict-code": return "#007bff";
            case "codes": return "#28a745";
            default: return "#6c757d";
        }
    };
    const getCategoryName = (category) => {
        switch (category) {
            case "extracted-text": return "Extracted Text";
            case "extracted-code": return "Extracted Code";
            case "ict-code": return "ICT Codes";
            case "codes": return "Codes";
            default: return "Other";
        }
    };
    return (React.createElement("div", { style: {
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f8f9fa",
        } },
        React.createElement("div", { style: {
                padding: "16px",
                borderBottom: "1px solid #dee2e6",
                backgroundColor: "white",
            } },
            React.createElement("h3", { style: { margin: "0 0 12px 0", fontSize: "18px", fontWeight: "600" } },
                "Highlights (",
                navigationInfo.total,
                ")"),
            React.createElement(HighlightNavigationControls, { current: navigationInfo.current, total: navigationInfo.total, hasNext: navigationInfo.hasNext, hasPrevious: navigationInfo.hasPrevious, isActive: navigationInfo.isActive, currentCategory: currentHighlight?.category, onNext: onNext, onPrevious: onPrevious, onStart: onStart, onClear: onClear })),
        React.createElement("div", { style: {
                flex: 1,
                overflowY: "auto",
                padding: "8px",
            } }, highlights.length === 0 ? (React.createElement("div", { style: {
                padding: "20px",
                textAlign: "center",
                color: "#6c757d",
                fontSize: "14px",
            } },
            "No highlights available.",
            React.createElement("br", null),
            "Add some extracted text or code to start navigating.")) : (Object.entries(highlightsByCategory).map(([category, categoryHighlights]) => {
            if (categoryHighlights.length === 0)
                return null;
            return (React.createElement("div", { key: category, style: { marginBottom: "16px" } },
                React.createElement("h4", { style: {
                        margin: "0 0 8px 0",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: getCategoryBorder(category),
                    } },
                    getCategoryName(category),
                    " (",
                    categoryHighlights.length,
                    ")"),
                categoryHighlights.map((highlight) => (React.createElement("div", { key: highlight.id, style: {
                        marginBottom: "6px",
                        padding: "10px",
                        backgroundColor: currentHighlight?.id === highlight.id
                            ? getCategoryColor(category)
                            : "white",
                        border: `1px solid ${currentHighlight?.id === highlight.id
                            ? getCategoryBorder(category)
                            : "#dee2e6"}`,
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        position: "relative",
                    }, onClick: () => onNavigateToHighlight(highlight.id) },
                    React.createElement("div", { style: {
                            fontSize: "12px",
                            fontFamily: highlight.category === "extracted-code" ? "monospace" : "inherit",
                            backgroundColor: highlight.category === "extracted-code" ? "#f8f9fa" : "transparent",
                            padding: highlight.category === "extracted-code" ? "4px" : "0",
                            borderRadius: "2px",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                        } }, formatText(highlight.text)),
                    currentHighlight?.id === highlight.id && (React.createElement("div", { style: {
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            width: "8px",
                            height: "8px",
                            backgroundColor: getCategoryBorder(category),
                            borderRadius: "50%",
                        } })),
                    React.createElement("div", { style: {
                            position: "absolute",
                            top: "4px",
                            left: "4px",
                            fontSize: "10px",
                            color: "#6c757d",
                            backgroundColor: "white",
                            padding: "1px 4px",
                            borderRadius: "2px",
                            border: "1px solid #dee2e6",
                        } }, highlight.index + 1),
                    onDelete && (React.createElement("button", { onClick: (e) => {
                            e.stopPropagation();
                            onDelete(highlight.id, highlight.category);
                        }, style: {
                            position: "absolute",
                            bottom: "4px",
                            right: "4px",
                            padding: "2px 4px",
                            fontSize: "10px",
                            border: "none",
                            borderRadius: "2px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            cursor: "pointer",
                        }, title: "Delete highlight" }, "\u00D7")))))));
        }))),
        React.createElement("div", { style: {
                padding: "12px 16px",
                borderTop: "1px solid #dee2e6",
                backgroundColor: "white",
                fontSize: "11px",
                color: "#6c757d",
            } },
            React.createElement("div", { style: { marginBottom: "8px" } },
                React.createElement("strong", null, "Keyboard Shortcuts:"),
                React.createElement("br", null),
                "\u2190 \u2192 Navigate \u2022 ESC Clear"),
            React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px" } },
                React.createElement("div", { style: { display: "flex", alignItems: "center" } },
                    React.createElement("div", { style: { width: "10px", height: "10px", backgroundColor: "rgba(255, 0, 0, 0.3)", marginRight: "4px" } }),
                    "Text"),
                React.createElement("div", { style: { display: "flex", alignItems: "center" } },
                    React.createElement("div", { style: { width: "10px", height: "10px", backgroundColor: "rgba(138, 43, 226, 0.3)", marginRight: "4px" } }),
                    "Code")))));
};
//# sourceMappingURL=NavigableHighlightSidebar.js.map