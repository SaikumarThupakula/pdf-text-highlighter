import React, { useRef, useState, useCallback } from "react";
import { PdfLoader, PdfHighlighter, CategorizedHighlightContainer, } from "../index";
import { NavigableHighlightSidebar } from "../components/NavigableHighlightSidebar";
import { useHighlightNavigation } from "../hooks/useHighlightNavigation";
// Sample data - replace with your actual data
const sampleExtractedTexts = [
    {
        id: "1",
        text: "Patient presents with chest pain and shortness of breath",
        position: {
            boundingRect: { x1: 100, y1: 200, x2: 400, y2: 220, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 100, y1: 200, x2: 400, y2: 220, width: 800, height: 1000, pageNumber: 1 }]
        }
    },
    {
        id: "2",
        text: "Blood pressure: 140/90 mmHg",
        position: {
            boundingRect: { x1: 100, y1: 300, x2: 300, y2: 320, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 100, y1: 300, x2: 300, y2: 320, width: 800, height: 1000, pageNumber: 1 }]
        }
    },
    {
        id: "3",
        text: "Diagnosis: Acute myocardial infarction",
        position: {
            boundingRect: { x1: 100, y1: 400, x2: 350, y2: 420, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 100, y1: 400, x2: 350, y2: 420, width: 800, height: 1000, pageNumber: 1 }]
        }
    }
];
const sampleExtractedCodes = [
    {
        id: "1",
        code: "function calculateBMI(weight, height) {\n  return weight / (height * height);\n}",
        position: {
            boundingRect: { x1: 150, y1: 500, x2: 450, y2: 560, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 150, y1: 500, x2: 450, y2: 560, width: 800, height: 1000, pageNumber: 1 }]
        }
    },
    {
        id: "2",
        code: "SELECT * FROM patients WHERE age > 65;",
        position: {
            boundingRect: { x1: 120, y1: 600, x2: 380, y2: 620, width: 800, height: 1000, pageNumber: 1 },
            rects: [{ x1: 120, y1: 600, x2: 380, y2: 620, width: 800, height: 1000, pageNumber: 1 }]
        }
    }
];
/**
 * Example showing navigation through extracted texts and codes
 */
const NavigationExample = () => {
    const highlighterUtilsRef = useRef();
    const [currentHighlight, setCurrentHighlight] = useState(null);
    // Handle highlight change
    const handleHighlightChange = useCallback((highlight) => {
        setCurrentHighlight(highlight);
    }, []);
    // Handle scroll to highlight
    const handleScrollToHighlight = useCallback((highlightId) => {
        if (highlighterUtilsRef.current) {
            highlighterUtilsRef.current.scrollToHighlight(highlightId);
        }
    }, []);
    // Use navigation hook
    const { currentHighlight: navCurrentHighlight, navigableHighlights, navigationInfo, highlightsByCategory, navigateNext, navigatePrevious, navigateToHighlight, clearNavigation, startNavigation, hasHighlights, } = useHighlightNavigation(sampleExtractedTexts, sampleExtractedCodes, handleHighlightChange, handleScrollToHighlight);
    // Create highlights array for PDF display
    const pdfHighlights = currentHighlight ? [currentHighlight] : [];
    const url = "https://arxiv.org/pdf/1708.08021.pdf";
    return (React.createElement("div", { style: { display: "flex", height: "100vh" } },
        React.createElement("div", { style: { width: "350px", borderRight: "1px solid #ccc" } },
            React.createElement(NavigableHighlightSidebar, { highlights: navigableHighlights, highlightsByCategory: highlightsByCategory, currentHighlight: navCurrentHighlight, navigationInfo: navigationInfo, onNext: navigateNext, onPrevious: navigatePrevious, onStart: startNavigation, onClear: clearNavigation, onNavigateToHighlight: navigateToHighlight })),
        React.createElement("div", { style: { flex: 1, position: "relative" } },
            React.createElement(PdfLoader, { document: url }, (pdfDocument) => (React.createElement(PdfHighlighter, { pdfDocument: pdfDocument, utilsRef: (utils) => {
                    highlighterUtilsRef.current = utils;
                }, highlights: pdfHighlights },
                React.createElement(CategorizedHighlightContainer, { onHighlightClick: (highlight, category) => {
                        console.log(`Clicked ${category} highlight:`, highlight.content?.text);
                    } })))),
            !hasHighlights && (React.createElement("div", { style: {
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    padding: "16px",
                    backgroundColor: "rgba(0, 123, 255, 0.9)",
                    color: "white",
                    borderRadius: "8px",
                    maxWidth: "300px",
                    fontSize: "14px",
                    zIndex: 100,
                } },
                React.createElement("h4", { style: { margin: "0 0 8px 0" } }, "Navigation Demo"),
                React.createElement("p", { style: { margin: "0 0 8px 0" } }, "This example shows navigation through sample extracted texts and codes."),
                React.createElement("p", { style: { margin: 0 } }, "Click \"Start Navigation\" in the sidebar to begin."))),
            navigationInfo.isActive && (React.createElement("div", { style: {
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    padding: "12px",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    borderRadius: "6px",
                    fontSize: "12px",
                    zIndex: 100,
                } },
                React.createElement("div", { style: { marginBottom: "4px" } },
                    React.createElement("strong", null, "Currently viewing:")),
                React.createElement("div", { style: { color: "#ffc107" } },
                    navCurrentHighlight?.category === "extracted-text" ? "📄" : "💻",
                    " ",
                    " ",
                    navCurrentHighlight?.category === "extracted-text" ? "Extracted Text" : "Extracted Code"),
                React.createElement("div", { style: { marginTop: "4px", fontSize: "10px", opacity: 0.8 } },
                    navigationInfo.current,
                    " of ",
                    navigationInfo.total))))));
};
export default NavigationExample;
//# sourceMappingURL=NavigationExample.js.map