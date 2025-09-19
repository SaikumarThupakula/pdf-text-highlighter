import React, { useRef, useEffect, useCallback } from "react";
import {
  PdfLoader,
  PdfHighlighter,
  PdfHighlighterUtils,
} from "../index";
import { CategorizedHighlightContainer } from "../components/CategorizedHighlightContainer";
import { useToggleHighlighting, ExtractedText, ICTCode, Code, DefaultText } from "../hooks/useToggleHighlighting";

// Example data
const extractedTexts: ExtractedText[] = [
  {
    id: "1",
    text: "Patient presents with chest pain",
    position: {
      boundingRect: {
        x1: 100, y1: 200, x2: 300, y2: 220,
        width: 800, height: 1000, pageNumber: 1
      },
      rects: [{
        x1: 100, y1: 200, x2: 300, y2: 220,
        width: 800, height: 1000, pageNumber: 1
      }]
    }
  },
  {
    id: "2",
    text: "Acute myocardial infarction diagnosed",
    position: {
      boundingRect: {
        x1: 100, y1: 400, x2: 400, y2: 420,
        width: 800, height: 1000, pageNumber: 1
      },
      rects: [{
        x1: 100, y1: 400, x2: 400, y2: 420,
        width: 800, height: 1000, pageNumber: 1
      }]
    }
  }
];

const ictCodes: ICTCode[] = [
  {
    id: "1",
    code: "I21.9",
    description: "Acute myocardial infarction",
    position: {
      boundingRect: {
        x1: 350, y1: 400, x2: 400, y2: 420,
        width: 800, height: 1000, pageNumber: 1
      },
      rects: [{
        x1: 350, y1: 400, x2: 400, y2: 420,
        width: 800, height: 1000, pageNumber: 1
      }]
    }
  }
];

const codes: Code[] = [
  {
    id: "1",
    text: "CODE123",
    position: {
      boundingRect: {
        x1: 200, y1: 300, x2: 280, y2: 320,
        width: 800, height: 1000, pageNumber: 1
      },
      rects: [{
        x1: 200, y1: 300, x2: 280, y2: 320,
        width: 800, height: 1000, pageNumber: 1
      }]
    }
  },
  {
    id: "2",
    text: "REF456",
    position: {
      boundingRect: {
        x1: 300, y1: 500, x2: 380, y2: 520,
        width: 800, height: 1000, pageNumber: 1
      },
      rects: [{
        x1: 300, y1: 500, x2: 380, y2: 520,
        width: 800, height: 1000, pageNumber: 1
      }]
    }
  }
];

const defaultTexts: DefaultText[] = [
  {
    id: "1",
    text: "Introduction",
    position: {
      boundingRect: {
        x1: 50, y1: 100, x2: 150, y2: 120,
        width: 800, height: 1000, pageNumber: 1
      },
      rects: [{
        x1: 50, y1: 100, x2: 150, y2: 120,
        width: 800, height: 1000, pageNumber: 1
      }]
    }
  }
];

const FixedToggleExample = () => {
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>();
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    currentHighlights,
    toggleExtractedText,
    toggleICTCodes,
    toggleCodes,
    handleDefaultTextTap,
    triggerUpdate,
    isExtractedTextActive,
    isICTCodesActive,
    isCodesActive,
    isDefaultTextActive,
    selectedDefaultTextId,
    codes: allCodes,
    hasCodes,
  } = useToggleHighlighting(extractedTexts, ictCodes, codes, defaultTexts);

  // Handle scroll events to fix highlight visibility
  const handleScroll = useCallback(() => {
    // Trigger update after scroll to ensure highlights are visible
    setTimeout(() => {
      triggerUpdate();
    }, 100);
  }, [triggerUpdate]);

  // Add scroll listener to PDF container
  useEffect(() => {
    const container = pdfContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  // Force update when highlights change
  useEffect(() => {
    if (currentHighlights.length > 0) {
      // Multiple update attempts to ensure visibility
      const timeouts = [50, 150, 300].map(delay => 
        setTimeout(() => triggerUpdate(), delay)
      );
      
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [currentHighlights.length, triggerUpdate]);

  const url = "https://arxiv.org/pdf/1708.08021.pdf";

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Control Panel */}
      <div style={{ width: "300px", padding: "20px", borderRight: "1px solid #ccc", overflow: "auto", backgroundColor: "#f8f9fa" }}>
        <h2 style={{ marginTop: 0 }}>Highlight Controls</h2>
        
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => {
              toggleExtractedText();
              // Force update after toggle
              setTimeout(() => triggerUpdate(), 200);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginBottom: "8px",
              backgroundColor: isExtractedTextActive ? "#dc3545" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isExtractedTextActive ? "Hide" : "Show"} Extracted Text ({extractedTexts.length})
          </button>

          <button
            onClick={() => {
              toggleICTCodes();
              // Force update after toggle
              setTimeout(() => triggerUpdate(), 200);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginBottom: "8px",
              backgroundColor: isICTCodesActive ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isICTCodesActive ? "Hide" : "Show"} ICT Codes ({ictCodes.filter(c => c.position).length})
          </button>

          <button
            onClick={() => {
              toggleCodes();
              // Force update after toggle
              setTimeout(() => triggerUpdate(), 200);
            }}
            disabled={!hasCodes}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginBottom: "8px",
              backgroundColor: isCodesActive ? "#28a745" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: hasCodes ? "pointer" : "not-allowed",
              opacity: hasCodes ? 1 : 0.6,
            }}
          >
            {isCodesActive ? "Hide" : "Show"} Codes ({allCodes.length})
          </button>

          <button
            onClick={() => {
              handleDefaultTextTap("1");
              // Force update after toggle
              setTimeout(() => triggerUpdate(), 200);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginBottom: "8px",
              backgroundColor: isDefaultTextActive && selectedDefaultTextId === "1" ? "#ffc107" : "#6c757d",
              color: isDefaultTextActive && selectedDefaultTextId === "1" ? "#000" : "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Toggle Default Text
          </button>

          <button
            onClick={() => {
              triggerUpdate();
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Force Refresh Highlights
          </button>
        </div>

        {/* Status Display */}
        <div style={{ padding: "10px", backgroundColor: "#e9ecef", borderRadius: "4px", fontSize: "12px" }}>
          <div><strong>Active Highlights:</strong> {currentHighlights.length}</div>
          <div><strong>Mode:</strong> {isExtractedTextActive ? "Extracted Text" : isICTCodesActive ? "ICT Codes" : isDefaultTextActive ? "Default Text" : "None"}</div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: "20px", fontSize: "12px", color: "#6c757d" }}>
          <p><strong>Legend:</strong></p>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <div style={{ width: "16px", height: "16px", backgroundColor: "rgba(255, 0, 0, 0.3)", marginRight: "8px" }}></div>
            Extracted Text (Red)
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <div style={{ width: "16px", height: "16px", backgroundColor: "rgba(0, 123, 255, 0.3)", marginRight: "8px" }}></div>
            ICT Codes (Blue)
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <div style={{ width: "16px", height: "16px", backgroundColor: "rgba(40, 167, 69, 0.3)", marginRight: "8px" }}></div>
            Codes (Green)
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "16px", height: "16px", backgroundColor: "rgba(255, 226, 143, 0.3)", marginRight: "8px" }}></div>
            Default Text (Yellow)
          </div>
        </div>

        <div style={{ marginTop: "20px", fontSize: "11px", color: "#6c757d", fontStyle: "italic" }}>
          <p>💡 <strong>Tip:</strong> If highlights don't appear immediately, try scrolling the PDF or clicking "Force Refresh Highlights"</p>
        </div>
      </div>

      {/* PDF Viewer */}
      <div ref={pdfContainerRef} style={{ flex: 1, overflow: "auto" }}>
        <PdfLoader document={url}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              utilsRef={(pdfHighlighterUtils) => {
                highlighterUtilsRef.current = pdfHighlighterUtils;
              }}
              highlights={currentHighlights}
              onScrollChange={() => {
                // Handle scroll changes
                handleScroll();
              }}
            >
              <CategorizedHighlightContainer
                onHighlightClick={(highlight, category) => {
                  console.log(`Clicked ${category || 'default'} highlight:`, highlight.content?.text);
                }}
              />
            </PdfHighlighter>
          )}
        </PdfLoader>
      </div>
    </div>
  );
};

export default FixedToggleExample;