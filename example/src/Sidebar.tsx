import React from "react";
import type { Highlight } from "./react-pdf-highlighter-extended";
import PdfUploader from "./PdfUploader";
import "./style/Sidebar.css";
import { CommentedHighlight } from "./types";

interface SidebarProps {
  highlights: Array<CommentedHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  onPdfUpload: (file: File) => void;
  onClearUpload: () => void;
  hasUploadedPdf: boolean;
  isUsingUploadedPdf: boolean;
  handleCategoryHighlight?: (highlight: CommentedHighlight) => void;
  activeCategoryHighlight?: "extracted-text" | "extracted-code" | "text+code" | "ict-code" | null;
  navigateToHighlight?: (category: "extracted-text" | "extracted-code" | "text+code" | "ict-code", direction: "prev" | "next") => void;
  getCurrentHighlightInfo?: (category: "extracted-text" | "extracted-code" | "text+code" | "ict-code") => { current: number; total: number; hasHighlights: boolean };
}

const updateHash = (highlight: Highlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

declare const APP_VERSION: string;

const Sidebar = ({
  highlights,
  toggleDocument,
  resetHighlights,
  onPdfUpload,
  onClearUpload,
  hasUploadedPdf,
  isUsingUploadedPdf,
  handleCategoryHighlight,
  activeCategoryHighlight,
  navigateToHighlight,
  getCurrentHighlightInfo,
}: SidebarProps) => {
  return (
    <div className="sidebar" style={{ width: "25vw", maxWidth: "500px" }}>
      {/* PDF Upload section */}
      <PdfUploader
        onPdfUpload={onPdfUpload}
        onClearUpload={onClearUpload}
        hasUploadedPdf={hasUploadedPdf}
      />


      {/* Description section */}
      {/* <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>
          react-pdf-highlighter-extended {APP_VERSION}
        </h2>

        <p style={{ fontSize: "0.7rem" }}>
          <a href="https://github.com/DanielArnould/react-pdf-highlighter-extended">
            Open in GitHub
          </a>
        </p>

        <p>
          <small>
            To create an area highlight hold ⌥ Option key (Alt), then click and
            drag.
          </small>
        </p>
      </div> */}

      {/* Highlights list with category support */}
      {highlights && highlights.length > 0 && (
        <>
          {/* Extracted Text Group */}
          {highlights.filter((h) => h.category === "extracted-text").length >
            0 && (
            <div className="sidebar__group">
              <h3
                className={`sidebar__group-title ${
                  activeCategoryHighlight === "extracted-text" ? "active" : ""
                }`}
                style={{
                  color:
                    activeCategoryHighlight === "extracted-text"
                      ? "#ff0000"
                      : "inherit",
                  cursor: "pointer",
                  padding: "0.5rem",
                  backgroundColor:
                    activeCategoryHighlight === "extracted-text"
                      ? "rgba(255, 0, 0, 0.1)"
                      : "transparent",
                }}
                onClick={() => {
                  // Toggle category highlighting when clicking the title
                  if (activeCategoryHighlight === "extracted-text") {
                    // If currently active, turn it off
                    if (handleCategoryHighlight) {
                      // Create a dummy non-extracted text highlight to turn off category highlighting
                      const dummyHighlight = { category: undefined } as any;
                      handleCategoryHighlight(dummyHighlight);
                    }
                  } else {
                    // If not active, turn it on
                    const firstExtractedText = highlights.find(
                      (h) => h.category === "extracted-text"
                    );
                    if (firstExtractedText && handleCategoryHighlight) {
                      handleCategoryHighlight(firstExtractedText);
                    }
                  }
                }}
              >
                Extracted Text (
                {
                  highlights.filter((h) => h.category === "extracted-text")
                    .length
                }
                )
                {activeCategoryHighlight === "extracted-text" &&
                  " - All Highlighted"}
              </h3>
              {getCurrentHighlightInfo && getCurrentHighlightInfo("extracted-text").hasHighlights && (
                <div style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem"
                }}>
                  <span>
                    {getCurrentHighlightInfo("extracted-text").current} of {getCurrentHighlightInfo("extracted-text").total}
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => navigateToHighlight && navigateToHighlight("extracted-text", "prev")}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                      title="Previous extracted text"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => navigateToHighlight && navigateToHighlight("extracted-text", "next")}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                      title="Next extracted text"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
              <ul className="sidebar__highlights">
                {highlights
                  .filter((h) => h.category === "extracted-text")
                  .map((highlight, index) => (
                    <li
                      key={index}
                      className="sidebar__highlight extracted-text"
                      style={{
                        backgroundColor:
                          activeCategoryHighlight === "extracted-text"
                            ? "rgba(255, 0, 0, 0.1)"
                            : "transparent",
                      }}
                      onClick={() => {
                        if (handleCategoryHighlight) {
                          handleCategoryHighlight(highlight);
                        } else {
                          updateHash(highlight);
                        }
                      }}
                    >
                      <div>
                        <strong>{highlight.comment}</strong>
                        {highlight.content.text && (
                          <blockquote style={{ marginTop: "0.5rem" }}>
                            {`${highlight.content.text.slice(0, 90).trim()}…`}
                          </blockquote>
                        )}
                        {highlight.content.image && (
                          <div
                            className="highlight__image__container"
                            style={{ marginTop: "0.5rem" }}
                          >
                            <img
                              src={highlight.content.image}
                              alt={"Screenshot"}
                              className="highlight__image"
                            />
                          </div>
                        )}
                      </div>
                      <div className="highlight__location">
                        Page {highlight.position.boundingRect.pageNumber}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Extracted Code Group */}
          {highlights.filter((h) => h.category === "extracted-code").length >
            0 && (
            <div className="sidebar__group">
              <h3
                className={`sidebar__group-title ${
                  activeCategoryHighlight === "extracted-code" ? "active" : ""
                }`}
                style={{
                  color:
                    activeCategoryHighlight === "extracted-code"
                      ? "#0066cc"
                      : "inherit",
                  cursor: "pointer",
                  padding: "0.5rem",
                  backgroundColor:
                    activeCategoryHighlight === "extracted-code"
                      ? "rgba(0, 102, 204, 0.1)"
                      : "transparent",
                }}
                onClick={() => {
                  // Toggle category highlighting when clicking the title
                  if (activeCategoryHighlight === "extracted-code") {
                    // If currently active, turn it off
                    if (handleCategoryHighlight) {
                      // Create a dummy non-extracted code highlight to turn off category highlighting
                      const dummyHighlight = { category: undefined } as any;
                      handleCategoryHighlight(dummyHighlight);
                    }
                  } else {
                    // If not active, turn it on
                    const firstExtractedCode = highlights.find(
                      (h) => h.category === "extracted-code"
                    );
                    if (firstExtractedCode && handleCategoryHighlight) {
                      handleCategoryHighlight(firstExtractedCode);
                    }
                  }
                }}
              >
                Extracted Code (
                {
                  highlights.filter((h) => h.category === "extracted-code")
                    .length
                }
                )
                {activeCategoryHighlight === "extracted-code" &&
                  " - All Highlighted"}
              </h3>
              {getCurrentHighlightInfo && getCurrentHighlightInfo("extracted-code").hasHighlights && (
                <div style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "rgba(0, 102, 204, 0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem"
                }}>
                  <span>
                    {getCurrentHighlightInfo("extracted-code").current} of {getCurrentHighlightInfo("extracted-code").total}
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => navigateToHighlight && navigateToHighlight("extracted-code", "prev")}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                      title="Previous extracted code"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => navigateToHighlight && navigateToHighlight("extracted-code", "next")}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                      title="Next extracted code"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
              <ul className="sidebar__highlights">
                {highlights
                  .filter((h) => h.category === "extracted-code")
                  .map((highlight, index) => (
                    <li
                      key={index}
                      className="sidebar__highlight extracted-code"
                      style={{
                        backgroundColor:
                          activeCategoryHighlight === "extracted-code"
                            ? "rgba(0, 102, 204, 0.1)"
                            : "transparent",
                      }}
                      onClick={() => {
                        if (handleCategoryHighlight) {
                          handleCategoryHighlight(highlight);
                        } else {
                          updateHash(highlight);
                        }
                      }}
                    >
                      <div>
                        <strong>{highlight.comment}</strong>
                        {highlight.content.text && (
                          <blockquote style={{ marginTop: "0.5rem" }}>
                            {`${highlight.content.text.slice(0, 90).trim()}…`}
                          </blockquote>
                        )}
                        {highlight.content.image && (
                          <div
                            className="highlight__image__container"
                            style={{ marginTop: "0.5rem" }}
                          >
                            <img
                              src={highlight.content.image}
                              alt={"Screenshot"}
                              className="highlight__image"
                            />
                          </div>
                        )}
                      </div>
                      <div className="highlight__location">
                        Page {highlight.position.boundingRect.pageNumber}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Mixed Group - combines both extracted-text and extracted-code */}
          {highlights.filter((h) => h.category === "text+code").length > 0 && (
            <div className="sidebar__group">
              <h3
                className={`sidebar__group-title ${activeCategoryHighlight === "text+code" ? "active" : ""}`}
                style={{
                  color: activeCategoryHighlight === "text+code" ? "#7b2cbf" : "inherit",
                  cursor: "pointer",
                  padding: "0.5rem",
                  backgroundColor: activeCategoryHighlight === "text+code" ? "rgba(123, 44, 191, 0.1)" : "transparent",
                }}
                onClick={() => {
                  // Toggle category highlighting when clicking the title
                  if (activeCategoryHighlight === "text+code") {
                    // If currently active, turn it off
                    if (handleCategoryHighlight) {
                      // Create a dummy non-text+code highlight to turn off category highlighting
                      const dummyHighlight = { category: undefined } as any;
                      handleCategoryHighlight(dummyHighlight);
                    }
                  } else {
                    // If not active, turn it on
                    const firstMixed = highlights.find((h) => h.category === "text+code");
                    if (firstMixed && handleCategoryHighlight) {
                      handleCategoryHighlight(firstMixed);
                    }
                  }
                }}
              >
                Text+Code Group ({highlights.filter((h) => h.category === "text+code").length})
                {activeCategoryHighlight === "text+code" && " - All Highlighted"}
              </h3>
              {getCurrentHighlightInfo && getCurrentHighlightInfo("text+code").hasHighlights && (
                <div style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "rgba(123, 44, 191, 0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem"
                }}>
                  <span>
                    {getCurrentHighlightInfo("text+code").current} of {getCurrentHighlightInfo("text+code").total}
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => navigateToHighlight && navigateToHighlight("text+code", "prev")}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#7b2cbf",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                      title="Previous in text+code group"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => navigateToHighlight && navigateToHighlight("text+code", "next")}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#7b2cbf",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                      title="Next in text+code group"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
              <ul className="sidebar__highlights">
                {highlights
                  .filter((h) => h.category === "text+code")
                  .map((highlight, index) => {
                    // Determine color based on subType
                    const isContentType = highlight.subType === "content";
                    const backgroundColor = activeCategoryHighlight === "text+code"
                      ? (isContentType ? "rgba(255, 0, 0, 0.1)" : "rgba(0, 102, 204, 0.1)")
                      : "transparent";
                    const borderLeft = isContentType ? "4px solid #ff0000" : "4px solid #0066cc";

                    return (
                      <li
                        key={index}
                        className={`sidebar__highlight text+code ${isContentType ? 'content-type' : 'implementation-type'}`}
                        style={{
                          backgroundColor,
                          borderLeft,
                          paddingLeft: "0.75rem"
                        }}
                        onClick={() => {
                          if (handleCategoryHighlight) {
                            handleCategoryHighlight(highlight);
                          } else {
                            updateHash(highlight);
                          }
                        }}
                      >
                        <div>
                          <strong>
                            <span style={{ color: isContentType ? "#dc3545" : "#007bff" }}>
                              {isContentType ? "[CONTENT] " : "[IMPLEMENTATION] "}
                            </span>
                            {highlight.comment}
                          </strong>
                          {highlight.content.text && (
                            <blockquote style={{ marginTop: "0.5rem" }}>
                              {`${highlight.content.text.slice(0, 90).trim()}…`}
                            </blockquote>
                          )}
                          {highlight.content.image && (
                            <div
                              className="highlight__image__container"
                              style={{ marginTop: "0.5rem" }}
                            >
                              <img
                                src={highlight.content.image}
                                alt={"Screenshot"}
                                className="highlight__image"
                              />
                            </div>
                          )}
                        </div>
                        <div className="highlight__location">
                          Page {highlight.position.boundingRect.pageNumber}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}

          {/* Other highlights */}
          {highlights.filter(
            (h) =>
              !h.category ||
              (h.category !== "extracted-text" &&
                h.category !== "extracted-code" &&
                h.category !== "text+code")
          ).length > 0 && (
            <div className="sidebar__group">
              <h3 className="sidebar__group-title">
                Other Highlights (
                {
                  highlights.filter(
                    (h) =>
                      !h.category ||
                      (h.category !== "extracted-text" &&
                        h.category !== "extracted-code" &&
                        h.category !== "text+code")
                  ).length
                }
                )
              </h3>
              <ul className="sidebar__highlights">
                {highlights
                  .filter(
                    (h) =>
                      !h.category ||
                      (h.category !== "extracted-text" &&
                        h.category !== "extracted-code" &&
                        h.category !== "text+code")
                  )
                  .map((highlight, index) => (
                    <li
                      key={index}
                      className="sidebar__highlight"
                      onClick={() => {
                        if (handleCategoryHighlight) {
                          handleCategoryHighlight(highlight);
                        } else {
                          updateHash(highlight);
                        }
                      }}
                    >
                      <div>
                        <strong>{highlight.comment}</strong>
                        {highlight.content.text && (
                          <blockquote style={{ marginTop: "0.5rem" }}>
                            {`${highlight.content.text.slice(0, 90).trim()}…`}
                          </blockquote>
                        )}
                        {highlight.content.image && (
                          <div
                            className="highlight__image__container"
                            style={{ marginTop: "0.5rem" }}
                          >
                            <img
                              src={highlight.content.image}
                              alt={"Screenshot"}
                              className="highlight__image"
                            />
                          </div>
                        )}
                      </div>
                      <div className="highlight__location">
                        Page {highlight.position.boundingRect.pageNumber}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </>
      )}

      {!isUsingUploadedPdf && (
        <div style={{ padding: "0.5rem" }}>
          <button onClick={toggleDocument} className="sidebar__toggle">
            Toggle PDF document
          </button>
        </div>
      )}

      {highlights && highlights.length > 0 && (
        <div style={{ padding: "0.5rem" }}>
          <button onClick={resetHighlights} className="sidebar__reset">
            Reset highlights
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
