import React, { useEffect } from "react";
import { PdfLoader, PdfHighlighter, useToggleHighlighting, CategorizedHighlightContainer, } from "../index";
// Your data with proper positions
const extractedTexts = [
    {
        id: "1",
        text: "Patient has chest pain",
        position: {
            boundingRect: { x1: 100, y1: 200, x2: 300, y2: 220, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 100, y1: 200, x2: 300, y2: 220, width: 800, height: 1000, pageNumber: 1 }]
        }
    }
];
const ictCodes = [
    {
        id: "1",
        code: "I21.9",
        description: "Acute myocardial infarction",
        position: {
            boundingRect: { x1: 350, y1: 400, x2: 400, y2: 420, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 350, y1: 400, x2: 400, y2: 420, width: 800, height: 1000, pageNumber: 1 }]
        }
    }
];
const codes = [
    {
        id: "1",
        text: "CODE123",
        position: {
            boundingRect: { x1: 200, y1: 300, x2: 280, y2: 320, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 200, y1: 300, x2: 280, y2: 320, width: 800, height: 1000, pageNumber: 1 }]
        }
    },
    {
        id: "2",
        text: "REF456",
        position: {
            boundingRect: { x1: 300, y1: 500, x2: 380, y2: 520, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 300, y1: 500, x2: 380, y2: 520, width: 800, height: 1000, pageNumber: 1 }]
        }
    }
];
const defaultTexts = [
    {
        id: "1",
        text: "Introduction",
        position: {
            boundingRect: { x1: 50, y1: 100, x2: 150, y2: 120, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 50, y1: 100, x2: 150, y2: 120, width: 800, height: 1000, pageNumber: 1 }]
        }
    }
];
const SimpleFixedExample = () => {
    const { currentHighlights, toggleExtractedText, toggleICTCodes, toggleCodes, handleDefaultTextTap, triggerUpdate, // This forces highlights to re-render
    isExtractedTextActive, isICTCodesActive, isCodesActive, } = useToggleHighlighting(extractedTexts, ictCodes, codes, defaultTexts);
    // Force update when highlights change to ensure visibility
    useEffect(() => {
        if (currentHighlights.length > 0) {
            // Multiple update attempts with different delays
            const timeouts = [100, 300, 500].map(delay => setTimeout(() => triggerUpdate(), delay));
            return () => {
                timeouts.forEach(timeout => clearTimeout(timeout));
            };
        }
    }, [currentHighlights.length, triggerUpdate]);
    return (React.createElement("div", { style: { display: "flex", height: "100vh" } },
        React.createElement("div", { style: { width: "250px", padding: "20px", borderRight: "1px solid #ccc", backgroundColor: "#f8f9fa" } },
            React.createElement("h3", null, "Highlight Controls"),
            React.createElement("button", { onClick: () => {
                    toggleExtractedText();
                    // Force multiple updates to ensure visibility
                    setTimeout(() => triggerUpdate(), 100);
                    setTimeout(() => triggerUpdate(), 300);
                }, style: {
                    display: "block",
                    width: "100%",
                    padding: "12px",
                    marginBottom: "10px",
                    backgroundColor: isExtractedTextActive ? "#dc3545" : "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                } },
                isExtractedTextActive ? "Hide" : "Show",
                " Extracted Text"),
            React.createElement("button", { onClick: () => {
                    toggleICTCodes();
                    // Force multiple updates to ensure visibility
                    setTimeout(() => triggerUpdate(), 100);
                    setTimeout(() => triggerUpdate(), 300);
                }, style: {
                    display: "block",
                    width: "100%",
                    padding: "12px",
                    marginBottom: "10px",
                    backgroundColor: isICTCodesActive ? "#007bff" : "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                } },
                isICTCodesActive ? "Hide" : "Show",
                " ICT Codes"),
            React.createElement("button", { onClick: () => {
                    toggleCodes();
                    // Force multiple updates to ensure visibility
                    setTimeout(() => triggerUpdate(), 100);
                    setTimeout(() => triggerUpdate(), 300);
                }, style: {
                    display: "block",
                    width: "100%",
                    padding: "12px",
                    marginBottom: "10px",
                    backgroundColor: isCodesActive ? "#28a745" : "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                } },
                isCodesActive ? "Hide" : "Show",
                " Codes"),
            React.createElement("button", { onClick: () => {
                    handleDefaultTextTap("1");
                    // Force multiple updates to ensure visibility
                    setTimeout(() => triggerUpdate(), 100);
                    setTimeout(() => triggerUpdate(), 300);
                }, style: {
                    display: "block",
                    width: "100%",
                    padding: "12px",
                    marginBottom: "20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                } }, "Toggle Default Text"),
            React.createElement("button", { onClick: () => {
                    triggerUpdate();
                    console.log("Manual refresh triggered");
                }, style: {
                    display: "block",
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                } }, "\uD83D\uDD04 Force Refresh Highlights"),
            React.createElement("div", { style: { marginTop: "20px", fontSize: "12px", color: "#6c757d" } },
                React.createElement("p", null,
                    React.createElement("strong", null, "Active Highlights:"),
                    " ",
                    currentHighlights.length),
                React.createElement("p", null,
                    React.createElement("strong", null, "Legend:")),
                React.createElement("div", { style: { display: "flex", alignItems: "center", marginBottom: "4px" } },
                    React.createElement("div", { style: { width: "12px", height: "12px", backgroundColor: "rgba(255, 0, 0, 0.3)", marginRight: "6px" } }),
                    "Extracted Text (Red)"),
                React.createElement("div", { style: { display: "flex", alignItems: "center", marginBottom: "4px" } },
                    React.createElement("div", { style: { width: "12px", height: "12px", backgroundColor: "rgba(0, 123, 255, 0.3)", marginRight: "6px" } }),
                    "ICT Codes (Blue)"),
                React.createElement("div", { style: { display: "flex", alignItems: "center", marginBottom: "4px" } },
                    React.createElement("div", { style: { width: "12px", height: "12px", backgroundColor: "rgba(40, 167, 69, 0.3)", marginRight: "6px" } }),
                    "Codes (Green)"),
                React.createElement("div", { style: { display: "flex", alignItems: "center", marginBottom: "8px" } },
                    React.createElement("div", { style: { width: "12px", height: "12px", backgroundColor: "rgba(255, 226, 143, 0.3)", marginRight: "6px" } }),
                    "Default Text (Yellow)"),
                React.createElement("p", null,
                    React.createElement("strong", null, "Tip:"),
                    " If highlights don't appear, try the refresh button or scroll the PDF slightly."))),
        React.createElement("div", { style: { flex: 1 } },
            React.createElement(PdfLoader, { document: "https://arxiv.org/pdf/1708.08021.pdf" }, (pdfDocument) => (React.createElement(PdfHighlighter, { pdfDocument: pdfDocument, highlights: currentHighlights, onScrollChange: () => {
                    // Trigger update on scroll to fix visibility issues
                    setTimeout(() => triggerUpdate(), 100);
                } },
                React.createElement(CategorizedHighlightContainer, { onHighlightClick: (highlight, category) => {
                        console.log(`Clicked ${category} highlight:`, highlight.content?.text);
                    } })))))));
};
export default SimpleFixedExample;
//# sourceMappingURL=SimpleFixedExample.js.map