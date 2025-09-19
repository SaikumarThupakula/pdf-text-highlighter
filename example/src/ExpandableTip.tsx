import React, { useLayoutEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm";
import {
  GhostHighlight,
  PdfSelection,
  usePdfHighlighterContext,
} from "./react-pdf-highlighter-extended";
import "./style/ExpandableTip.css";

interface ExpandableTipProps {
  addHighlight: (highlight: GhostHighlight, comment: string, category?: "extracted-text" | "extracted-code" | "text+code", subType?: "content" | "implementation") => void;
}

const ExpandableTip = ({ addHighlight }: ExpandableTipProps) => {
  const [compact, setCompact] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"extracted-text" | "extracted-code" | "text+code" | undefined>(undefined);
  const [selectedSubType, setSelectedSubType] = useState<"content" | "implementation" | undefined>(undefined);
  const selectionRef = useRef<PdfSelection | null>(null);

  const {
    getCurrentSelection,
    removeGhostHighlight,
    setTip,
    updateTipPosition,
  } = usePdfHighlighterContext();

  useLayoutEffect(() => {
    updateTipPosition!();
  }, [compact]);

  return (
    <div className="Tip">
      {compact ? (
        <button
          className="Tip__compact"
          onClick={() => {
            setCompact(false);
            selectionRef.current = getCurrentSelection();
            selectionRef.current!.makeGhostHighlight();
          }}
        >
          Add highlight
        </button>
      ) : (
        <div className="Tip__expanded">
          <div className="Tip__category-selector">
            <label>Category:</label>
            <select
              value={selectedCategory || ""}
              onChange={(e) => {
                const newCategory = e.target.value as "extracted-text" | "extracted-code" | "text+code" | undefined || undefined;
                setSelectedCategory(newCategory);
                // Reset subType when category changes
                if (newCategory !== "text+code") {
                  setSelectedSubType(undefined);
                }
              }}
              className="Tip__category-select"
            >
              <option value="">Default</option>
              <option value="extracted-text">Extracted Text</option>
              <option value="extracted-code">Extracted Code</option>
              <option value="text+code">Text+Code Group</option>
            </select>
          </div>

          {/* Sub-type selector for text+code category */}
          {selectedCategory === "text+code" && (
            <div className="Tip__category-selector">
              <label>Type:</label>
              <select
                value={selectedSubType || ""}
                onChange={(e) => setSelectedSubType(e.target.value as "content" | "implementation" | undefined || undefined)}
                className="Tip__category-select"
              >
                <option value="">Select Type</option>
                <option value="content">Content (Red)</option>
                <option value="implementation">Implementation (Blue)</option>
              </select>
            </div>
          )}
          <CommentForm
            placeHolder="Your comment..."
            onSubmit={(input) => {
              addHighlight(
                {
                  content: selectionRef.current!.content,
                  type: selectionRef.current!.type,
                  position: selectionRef.current!.position,
                },
                input,
                selectedCategory,
                selectedSubType
              );

              removeGhostHighlight();
              setTip(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ExpandableTip;
