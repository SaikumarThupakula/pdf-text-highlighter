import React, { useRef, useState } from "react";
import { PdfLoader, PdfHighlighter, CategorizedHighlightContainer, HighlightNavigationControls, useHighlightNavigation, } from "../index";
// Sample data
const extractedTexts = [
    {
        id: "1",
        text: "Patient has chest pain",
        position: {
            boundingRect: { x1: 100, y1: 200, x2: 300, y2: 220, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 100, y1: 200, x2: 300, y2: 220, width: 800, height: 1000, pageNumber: 1 }]
        }
    },
    {
        id: "2",
        text: "Blood pressure elevated",
        position: {
            boundingRect: { x1: 100, y1: 300, x2: 280, y2: 320, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 100, y1: 300, x2: 280, y2: 320, width: 800, height: 1000, pageNumber: 1 }]
        }
    }
];
const extractedCodes = [
    {
        id: "1",
        code: "function calculateBMI() { return weight / height; }",
        position: {
            boundingRect: { x1: 150, y1: 400, x2: 450, y2: 420, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 150, y1: 400, x2: 450, y2: 420, width: 800, height: 1000, pageNumber: 1 }]
        }
    }
];
const SimpleNavigationExample = () => {
    const highlighterUtilsRef = useRef();
    const [currentHighlight, setCurrentHighlight] = useState(null);
    const { currentHighlight: navCurrentHighlight, navigationInfo, navigateNext, navigatePrevious, clearNavigation, startNavigation, } = useHighlightNavigation(extractedTexts, extractedCodes, setCurrentHighlight, (highlightId) => {
        if (highlighterUtilsRef.current) {
            highlighterUtilsRef.current.scrollToHighlight(highlightId);
        }
    });
    const pdfHighlights = currentHighlight ? [currentHighlight] : [];
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100vh" } },
        React.createElement("div", { style: {
                padding: "16px",
                borderBottom: "1px solid #ccc",
                backgroundColor: "#f8f9fa",
                display: "flex",
                justifyContent: "center",
            } },
            React.createElement(HighlightNavigationControls, { current: navigationInfo.current, total: navigationInfo.total, hasNext: navigationInfo.hasNext, hasPrevious: navigationInfo.hasPrevious, isActive: navigationInfo.isActive, currentCategory: navCurrentHighlight?.category, onNext: navigateNext, onPrevious: navigatePrevious, onStart: startNavigation, onClear: clearNavigation })),
        React.createElement("div", { style: { flex: 1 } },
            React.createElement(PdfLoader, { document: "https://arxiv.org/pdf/1708.08021.pdf" }, (pdfDocument) => (React.createElement(PdfHighlighter, { pdfDocument: pdfDocument, utilsRef: (utils) => {
                    highlighterUtilsRef.current = utils;
                }, highlights: pdfHighlights },
                React.createElement(CategorizedHighlightContainer, null))))),
        navCurrentHighlight && (React.createElement("div", { style: {
                position: "fixed",
                bottom: "20px",
                left: "20px",
                padding: "12px",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                borderRadius: "6px",
                maxWidth: "300px",
                fontSize: "12px",
            } },
            React.createElement("div", { style: { marginBottom: "4px" } },
                React.createElement("strong", null, "Current:"),
                " ",
                navCurrentHighlight.category === "extracted-text" ? "Text" : "Code"),
            React.createElement("div", { style: {
                    fontFamily: navCurrentHighlight.category === "extracted-code" ? "monospace" : "inherit",
                    fontSize: "11px",
                    opacity: 0.9,
                } }, navCurrentHighlight.text.length > 100
                ? navCurrentHighlight.text.substring(0, 100) + "..."
                : navCurrentHighlight.text)))));
};
export default SimpleNavigationExample;
//# sourceMappingURL=SimpleNavigationExample.js.map