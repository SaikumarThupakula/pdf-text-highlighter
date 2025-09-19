import React, { useEffect } from "react";
import { HighlightNavigationControls } from "./HighlightNavigationControls";
import type { NavigableHighlight } from "../hooks/useHighlightNavigation";

/**
 * Props for the NavigableHighlightSidebar component
 */
export interface NavigableHighlightSidebarProps {
  /**
   * List of navigable highlights
   */
  highlights: NavigableHighlight[];
  
  /**
   * Highlights grouped by category
   */
  highlightsByCategory: Record<string, NavigableHighlight[]>;
  
  /**
   * Currently selected highlight
   */
  currentHighlight: NavigableHighlight | null;
  
  /**
   * Navigation info
   */
  navigationInfo: {
    current: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isActive: boolean;
  };
  
  /**
   * Navigation callbacks
   */
  onNext: () => void;
  onPrevious: () => void;
  onStart: () => void;
  onClear: () => void;
  onNavigateToHighlight: (id: string) => void;
  
  /**
   * Delete callback
   */
  onDelete?: (id: string, category: string) => void;
}

/**
 * Sidebar component with navigation controls and highlight list
 */
export const NavigableHighlightSidebar = ({
  highlights,
  highlightsByCategory,
  currentHighlight,
  navigationInfo,
  onNext,
  onPrevious,
  onStart,
  onClear,
  onNavigateToHighlight,
  onDelete,
}: NavigableHighlightSidebarProps) => {
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!navigationInfo.isActive) return;
      
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        onPrevious();
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        onNext();
      } else if (event.key === "Escape") {
        event.preventDefault();
        onClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigationInfo.isActive, onNext, onPrevious, onClear]);

  const formatText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "extracted-text": return "rgba(255, 0, 0, 0.1)";
      case "extracted-code": return "rgba(138, 43, 226, 0.1)";
      case "ict-code": return "rgba(0, 123, 255, 0.1)";
      case "codes": return "rgba(40, 167, 69, 0.1)";
      default: return "rgba(108, 117, 125, 0.1)";
    }
  };

  const getCategoryBorder = (category: string) => {
    switch (category) {
      case "extracted-text": return "#ff0000";
      case "extracted-code": return "#8a2be2";
      case "ict-code": return "#007bff";
      case "codes": return "#28a745";
      default: return "#6c757d";
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "extracted-text": return "Extracted Text";
      case "extracted-code": return "Extracted Code";
      case "ict-code": return "ICT Codes";
      case "codes": return "Codes";
      default: return "Other";
    }
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f8f9fa",
    }}>
      {/* Header with Navigation Controls */}
      <div style={{
        padding: "16px",
        borderBottom: "1px solid #dee2e6",
        backgroundColor: "white",
      }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "600" }}>
          Highlights ({navigationInfo.total})
        </h3>
        
        <HighlightNavigationControls
          current={navigationInfo.current}
          total={navigationInfo.total}
          hasNext={navigationInfo.hasNext}
          hasPrevious={navigationInfo.hasPrevious}
          isActive={navigationInfo.isActive}
          currentCategory={currentHighlight?.category}
          onNext={onNext}
          onPrevious={onPrevious}
          onStart={onStart}
          onClear={onClear}
        />
      </div>

      {/* Highlight List */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "8px",
      }}>
        {highlights.length === 0 ? (
          <div style={{
            padding: "20px",
            textAlign: "center",
            color: "#6c757d",
            fontSize: "14px",
          }}>
            No highlights available.
            <br />
            Add some extracted text or code to start navigating.
          </div>
        ) : (
          Object.entries(highlightsByCategory).map(([category, categoryHighlights]) => {
            if (categoryHighlights.length === 0) return null;
            
            return (
              <div key={category} style={{ marginBottom: "16px" }}>
                <h4 style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: getCategoryBorder(category),
                }}>
                  {getCategoryName(category)} ({categoryHighlights.length})
                </h4>
                
                {categoryHighlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    style={{
                      marginBottom: "6px",
                      padding: "10px",
                      backgroundColor: currentHighlight?.id === highlight.id 
                        ? getCategoryColor(category) 
                        : "white",
                      border: `1px solid ${
                        currentHighlight?.id === highlight.id 
                          ? getCategoryBorder(category) 
                          : "#dee2e6"
                      }`,
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative",
                    }}
                    onClick={() => onNavigateToHighlight(highlight.id)}
                  >
                    {/* Highlight Content */}
                    <div style={{
                      fontSize: "12px",
                      fontFamily: highlight.category === "extracted-code" ? "monospace" : "inherit",
                      backgroundColor: highlight.category === "extracted-code" ? "#f8f9fa" : "transparent",
                      padding: highlight.category === "extracted-code" ? "4px" : "0",
                      borderRadius: "2px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}>
                      {formatText(highlight.text)}
                    </div>

                    {/* Current Indicator */}
                    {currentHighlight?.id === highlight.id && (
                      <div style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        width: "8px",
                        height: "8px",
                        backgroundColor: getCategoryBorder(category),
                        borderRadius: "50%",
                      }} />
                    )}

                    {/* Index Number */}
                    <div style={{
                      position: "absolute",
                      top: "4px",
                      left: "4px",
                      fontSize: "10px",
                      color: "#6c757d",
                      backgroundColor: "white",
                      padding: "1px 4px",
                      borderRadius: "2px",
                      border: "1px solid #dee2e6",
                    }}>
                      {highlight.index + 1}
                    </div>

                    {/* Delete Button */}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(highlight.id, highlight.category);
                        }}
                        style={{
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
                        }}
                        title="Delete highlight"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Footer with Legend and Shortcuts */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid #dee2e6",
        backgroundColor: "white",
        fontSize: "11px",
        color: "#6c757d",
      }}>
        <div style={{ marginBottom: "8px" }}>
          <strong>Keyboard Shortcuts:</strong>
          <br />
          ← → Navigate • ESC Clear
        </div>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "10px", height: "10px", backgroundColor: "rgba(255, 0, 0, 0.3)", marginRight: "4px" }}></div>
            Text
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "10px", height: "10px", backgroundColor: "rgba(138, 43, 226, 0.3)", marginRight: "4px" }}></div>
            Code
          </div>
        </div>
      </div>
    </div>
  );
};