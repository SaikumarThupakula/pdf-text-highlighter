import React, { useRef, useState, useCallback } from "react";
import {
  PdfLoader,
  PdfHighlighter,
  PdfHighlighterUtils,
  CategorizedHighlightContainer,
} from "../index";
import { NavigableHighlightSidebar } from "../components/NavigableHighlightSidebar";
import { useHighlightNavigation } from "../hooks/useHighlightNavigation";
import type { Highlight } from "../types";

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
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>();
  const [currentHighlight, setCurrentHighlight] = useState<Highlight | null>(null);

  // Handle highlight change
  const handleHighlightChange = useCallback((highlight: Highlight | null) => {
    setCurrentHighlight(highlight);
  }, []);

  // Handle scroll to highlight
  const handleScrollToHighlight = useCallback((highlightId: string) => {
    if (highlighterUtilsRef.current) {
      highlighterUtilsRef.current.scrollToHighlight(highlightId);
    }
  }, []);

  // Use navigation hook
  const {
    currentHighlight: navCurrentHighlight,
    navigableHighlights,
    navigationInfo,
    highlightsByCategory,
    navigateNext,
    navigatePrevious,
    navigateToHighlight,
    clearNavigation,
    startNavigation,
    hasHighlights,
  } = useHighlightNavigation(
    sampleExtractedTexts,
    sampleExtractedCodes,
    handleHighlightChange,
    handleScrollToHighlight
  );

  // Create highlights array for PDF display
  const pdfHighlights = currentHighlight ? [currentHighlight] : [];

  const url = "https://arxiv.org/pdf/1708.08021.pdf";

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Navigation Sidebar */}
      <div style={{ width: "350px", borderRight: "1px solid #ccc" }}>
        <NavigableHighlightSidebar
          highlights={navigableHighlights}
          highlightsByCategory={highlightsByCategory}
          currentHighlight={navCurrentHighlight}
          navigationInfo={navigationInfo}
          onNext={navigateNext}
          onPrevious={navigatePrevious}
          onStart={startNavigation}
          onClear={clearNavigation}
          onNavigateToHighlight={navigateToHighlight}
        />
      </div>

      {/* PDF Viewer */}
      <div style={{ flex: 1, position: "relative" }}>
        <PdfLoader document={url}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              utilsRef={(utils) => {
                highlighterUtilsRef.current = utils;
              }}
              highlights={pdfHighlights}
            >
              <CategorizedHighlightContainer
                onHighlightClick={(highlight, category) => {
                  console.log(`Clicked ${category} highlight:`, highlight.content?.text);
                }}
              />
            </PdfHighlighter>
          )}
        </PdfLoader>

        {/* Instructions Overlay */}
        {!hasHighlights && (
          <div style={{
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
          }}>
            <h4 style={{ margin: "0 0 8px 0" }}>Navigation Demo</h4>
            <p style={{ margin: "0 0 8px 0" }}>
              This example shows navigation through sample extracted texts and codes.
            </p>
            <p style={{ margin: 0 }}>
              Click "Start Navigation" in the sidebar to begin.
            </p>
          </div>
        )}

        {/* Navigation Status */}
        {navigationInfo.isActive && (
          <div style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            padding: "12px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            borderRadius: "6px",
            fontSize: "12px",
            zIndex: 100,
          }}>
            <div style={{ marginBottom: "4px" }}>
              <strong>Currently viewing:</strong>
            </div>
            <div style={{ color: "#ffc107" }}>
              {navCurrentHighlight?.category === "extracted-text" ? "📄" : "💻"} {" "}
              {navCurrentHighlight?.category === "extracted-text" ? "Extracted Text" : "Extracted Code"}
            </div>
            <div style={{ marginTop: "4px", fontSize: "10px", opacity: 0.8 }}>
              {navigationInfo.current} of {navigationInfo.total}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationExample;