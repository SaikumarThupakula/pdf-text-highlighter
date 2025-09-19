import React from "react";

/**
 * Props for the HighlightNavigationControls component
 */
export interface HighlightNavigationControlsProps {
  /**
   * Current highlight number (1-based)
   */
  current: number;
  
  /**
   * Total number of highlights
   */
  total: number;
  
  /**
   * Whether there is a next highlight
   */
  hasNext: boolean;
  
  /**
   * Whether there is a previous highlight
   */
  hasPrevious: boolean;
  
  /**
   * Whether navigation is currently active
   */
  isActive: boolean;
  
  /**
   * Current highlight category
   */
  currentCategory?: string;
  
  /**
   * Callback for next navigation
   */
  onNext: () => void;
  
  /**
   * Callback for previous navigation
   */
  onPrevious: () => void;
  
  /**
   * Callback to start navigation
   */
  onStart: () => void;
  
  /**
   * Callback to clear navigation
   */
  onClear: () => void;
}

/**
 * Navigation controls component with arrow buttons
 */
export const HighlightNavigationControls = ({
  current,
  total,
  hasNext,
  hasPrevious,
  isActive,
  currentCategory,
  onNext,
  onPrevious,
  onStart,
  onClear,
}: HighlightNavigationControlsProps) => {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "extracted-text": return "#ff0000";
      case "extracted-code": return "#8a2be2";
      case "ict-code": return "#007bff";
      case "codes": return "#28a745";
      default: return "#6c757d";
    }
  };

  const getCategoryName = (category?: string) => {
    switch (category) {
      case "extracted-text": return "Extracted Text";
      case "extracted-code": return "Extracted Code";
      case "ict-code": return "ICT Code";
      case "codes": return "Code";
      default: return "Highlight";
    }
  };

  if (total === 0) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "6px",
        fontSize: "14px",
        color: "#6c757d",
      }}>
        No highlights to navigate
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      backgroundColor: "white",
      border: "1px solid #dee2e6",
      borderRadius: "6px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }}>
      {/* Start/Clear Button */}
      {!isActive ? (
        <button
          onClick={onStart}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            border: "1px solid #007bff",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Start Navigation
        </button>
      ) : (
        <button
          onClick={onClear}
          style={{
            padding: "4px 8px",
            fontSize: "11px",
            border: "1px solid #6c757d",
            borderRadius: "3px",
            backgroundColor: "white",
            color: "#6c757d",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      )}

      {/* Navigation Arrows */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <button
          onClick={onPrevious}
          disabled={!isActive || !hasPrevious}
          style={{
            padding: "6px 8px",
            fontSize: "14px",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            backgroundColor: (!isActive || !hasPrevious) ? "#f8f9fa" : "white",
            color: (!isActive || !hasPrevious) ? "#6c757d" : "#495057",
            cursor: (!isActive || !hasPrevious) ? "not-allowed" : "pointer",
          }}
          title="Previous highlight"
        >
          ←
        </button>

        <button
          onClick={onNext}
          disabled={!isActive || !hasNext}
          style={{
            padding: "6px 8px",
            fontSize: "14px",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            backgroundColor: (!isActive || !hasNext) ? "#f8f9fa" : "white",
            color: (!isActive || !hasNext) ? "#6c757d" : "#495057",
            cursor: (!isActive || !hasNext) ? "not-allowed" : "pointer",
          }}
          title="Next highlight"
        >
          →
        </button>
      </div>

      {/* Current Position */}
      {isActive && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
        }}>
          <span style={{ color: "#495057" }}>
            {current} of {total}
          </span>
          
          {currentCategory && (
            <span style={{
              padding: "2px 6px",
              fontSize: "10px",
              backgroundColor: getCategoryColor(currentCategory),
              color: "white",
              borderRadius: "3px",
            }}>
              {getCategoryName(currentCategory)}
            </span>
          )}
        </div>
      )}

      {/* Keyboard Shortcuts Info */}
      {isActive && (
        <div style={{
          fontSize: "11px",
          color: "#6c757d",
          marginLeft: "8px",
        }}>
          Use ← → keys
        </div>
      )}
    </div>
  );
};