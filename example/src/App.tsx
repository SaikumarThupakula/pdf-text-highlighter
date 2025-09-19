import React, { MouseEvent, useEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm";
import ContextMenu, { ContextMenuProps } from "./ContextMenu";
import ExpandableTip from "./ExpandableTip";
import HighlightContainer from "./HighlightContainer";
import PdfUploader from "./PdfUploader";
import { SearchBar, type SearchResult } from "./SearchBar";
import { SearchService } from "./SearchService";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import {
  GhostHighlight,
  Highlight,
  PdfHighlighter,
  PdfHighlighterUtils,
  PdfLoader,
  Tip,
  ViewportHighlight,
} from "./react-pdf-highlighter-extended";
import "./style/App.css";
import { testHighlights as _testHighlights } from "./test-highlights";
import { CommentedHighlight } from "./types";

const TEST_HIGHLIGHTS = _testHighlights;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/2203.11115";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480";

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => {
  return document.location.hash.slice("#highlight-".length);
};

const resetHash = () => {
  document.location.hash = "";
};

const clearHighlightSelection = () => {
  document.location.hash = "";
};

const App = () => {
  const [url, setUrl] = useState(PRIMARY_PDF_URL);
  const [highlights, setHighlights] = useState<Array<CommentedHighlight>>(
    TEST_HIGHLIGHTS[PRIMARY_PDF_URL] ?? []
  );

  const currentPdfIndexRef = useRef(0);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);
  const [pdfScaleValue, setPdfScaleValue] = useState<number | undefined>(
    undefined
  );
  const [highlightPen, setHighlightPen] = useState<boolean>(false);

  // Upload-related state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileData, setUploadedFileData] = useState<ArrayBuffer | null>(
    null
  );
  const [isUsingUploadedPdf, setIsUsingUploadedPdf] = useState(false);

  // Refs for PdfHighlighter utilities
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>();

  // Search state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHighlights, setSearchHighlights] = useState<
    Array<CommentedHighlight>
  >([]);
  const searchServiceRef = useRef<any>(null);

  // Category highlighting state
  const [activeCategoryHighlight, setActiveCategoryHighlight] = useState<
    "extracted-text" | "extracted-code" | "text+code" | "ict-code" | null
  >(null);


  // Navigation state for categories
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState<{
    [category: string]: number;
  }>({
    "extracted-text": 0,
    "extracted-code": 0,
    "text+code": 0,
    "ict-code": 0,
  });

  // Search functionality
  const handleSearch = async (query: string) => {
    if (!searchServiceRef.current) return;

    setIsSearching(true);
    try {
      const results: SearchResult[] = await searchServiceRef.current.searchText(
        query
      );
      setSearchResults(results);
      setCurrentSearchIndex(0);

      // Convert search results to highlights using scaled coordinates
      const highlights: CommentedHighlight[] = results.map(
        (result: SearchResult, index: number) => ({
          id: `search-${result.id}`,
          type: "text" as const,
          category: undefined,
          comment: `Search result: "${result.text}"`,
          content: { text: result.text },
          position: result.scaledPosition,
        })
      );

      setSearchHighlights(highlights);

      // Navigate to first result if any
      if (results.length > 0) {
        setTimeout(() => {
          document.location.hash = `highlight-search-${results[0].id}`;
        }, 100);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchNavigation = (direction: "prev" | "next") => {
    if (searchResults.length === 0) return;

    let newIndex = currentSearchIndex;
    if (direction === "next") {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex =
        currentSearchIndex === 0
          ? searchResults.length - 1
          : currentSearchIndex - 1;
    }

    setCurrentSearchIndex(newIndex);
    const result = searchResults[newIndex];
    document.location.hash = `highlight-search-${result.id}`;
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setSearchHighlights([]);
    setCurrentSearchIndex(0);
    resetHash();
  };

  // Handle PDF upload
  const handlePdfUpload = (file: File) => {
    setUploadedFile(file);

    // Convert file to ArrayBuffer for PDF.js
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        setUploadedFileData(e.target.result);
        setIsUsingUploadedPdf(true);
        setHighlights([]);
        handleClearSearch(); // Clear search results
        resetHash(); // Clear any hash
        setPdfScaleValue(undefined); // Reset scale for new PDF
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Clear uploaded PDF and return to demo PDFs
  const handleClearUpload = () => {
    setUploadedFile(null);
    setUploadedFileData(null);
    setIsUsingUploadedPdf(false);
    setUrl(PRIMARY_PDF_URL);
    setHighlights(TEST_HIGHLIGHTS[PRIMARY_PDF_URL] ?? []);
    currentPdfIndexRef.current = 0;
    handleClearSearch(); // Clear search results
    resetHash();
    setPdfScaleValue(undefined); // Reset scale
  };

  // Custom function to handle scroll away
  const handleScrollAway = () => {
    resetHash();
  };

  const toggleDocument = () => {
    // Only allow toggling between demo PDFs if not using uploaded PDF
    if (isUsingUploadedPdf) return;

    const urls = [PRIMARY_PDF_URL, SECONDARY_PDF_URL];
    currentPdfIndexRef.current = (currentPdfIndexRef.current + 1) % urls.length;
    setUrl(urls[currentPdfIndexRef.current]);
    setHighlights(TEST_HIGHLIGHTS[urls[currentPdfIndexRef.current]] ?? []);
    handleClearSearch(); // Clear search results when switching documents
  };

  // Click listeners for context menu
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [contextMenu]);

  const handleContextMenu = (
    event: MouseEvent<HTMLDivElement>,
    highlight: ViewportHighlight<CommentedHighlight>
  ) => {
    event.preventDefault();

    setContextMenu({
      xPos: event.clientX,
      yPos: event.clientY,
      deleteHighlight: () => deleteHighlight(highlight),
      editComment: () => editComment(highlight),
    });
  };

  const addHighlight = (
    highlight: GhostHighlight,
    comment: string,
    category?: "extracted-text" | "extracted-code" | "text+code",
    subType?: "content" | "implementation"
  ) => {
    console.log("Saving highlight", highlight);
    const newHighlight = {
      ...highlight,
      comment,
      category,
      subType: category === "text+code" ? subType : undefined,
      id: getNextId(),
    };
    setHighlights([newHighlight, ...highlights]);

    // Force navigation to the new highlight to ensure it's visible
    setTimeout(() => {
      document.location.hash = `highlight-${newHighlight.id}`;
      // Also trigger a re-render by clearing and setting the hash
      setTimeout(() => {
        if (highlighterUtilsRef.current) {
          highlighterUtilsRef.current.scrollToHighlight(newHighlight);
        }
      }, 100);
    }, 50);
  };

  // Function to handle category-wide highlighting
  const handleCategoryHighlight = (highlight: CommentedHighlight) => {
    // Set category state for highlights that have categories
    if (highlight.category === "extracted-text") {
      setActiveCategoryHighlight("extracted-text");
    } else if (highlight.category === "extracted-code") {
      setActiveCategoryHighlight("extracted-code");
    } else if (highlight.category === "text+code") {
      setActiveCategoryHighlight("text+code");
    } else if (highlight.category === "ict-code") {
      setActiveCategoryHighlight("ict-code");
    } else {
      // Clear category highlighting for non-categorized highlights (test highlights, etc.)
      setActiveCategoryHighlight(null);
    }

    // Navigate to the clicked highlight
    document.location.hash = `highlight-${highlight.id}`;
  };

  // Navigate through highlights of a specific category
  const navigateToHighlight = (
    category: "extracted-text" | "extracted-code" | "text+code" | "ict-code",
    direction: "prev" | "next"
  ) => {
    const categoryHighlights = highlights.filter(
      (h) => h.category === category
    );
    if (categoryHighlights.length === 0) return;

    const currentIndex = currentHighlightIndex[category] || 0;
    let newIndex = currentIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % categoryHighlights.length;
    } else {
      newIndex =
        currentIndex === 0 ? categoryHighlights.length - 1 : currentIndex - 1;
    }

    setCurrentHighlightIndex((prev) => ({ ...prev, [category]: newIndex }));
    const highlight = categoryHighlights[newIndex];

    // Activate category highlighting and navigate to the highlight
    setActiveCategoryHighlight(category);
    document.location.hash = `highlight-${highlight.id}`;
  };

  const getCurrentHighlightInfo = (
    category: "extracted-text" | "extracted-code" | "text+code" | "ict-code"
  ) => {
    const categoryHighlights = highlights.filter(
      (h) => h.category === category
    );
    const currentIndex = currentHighlightIndex[category] || 0;
    return {
      current: currentIndex + 1,
      total: categoryHighlights.length,
      hasHighlights: categoryHighlights.length > 0,
    };
  };

  const deleteHighlight = (highlight: ViewportHighlight | Highlight) => {
    console.log("Deleting highlight", highlight);
    setHighlights(highlights.filter((h) => h.id != highlight.id));
  };

  const editHighlight = (
    idToUpdate: string,
    edit: Partial<CommentedHighlight>
  ) => {
    console.log(`Editing highlight ${idToUpdate} with `, edit);
    setHighlights(
      highlights.map((highlight) =>
        highlight.id === idToUpdate ? { ...highlight, ...edit } : highlight
      )
    );
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  // Open comment tip and update highlight with new user input
  const editComment = (highlight: ViewportHighlight<CommentedHighlight>) => {
    if (!highlighterUtilsRef.current) return;

    const editCommentTip: Tip = {
      position: highlight.position,
      content: (
        <CommentForm
          placeHolder={highlight.comment}
          onSubmit={(input) => {
            editHighlight(highlight.id, { comment: input });
            highlighterUtilsRef.current!.setTip(null);
            highlighterUtilsRef.current!.toggleEditInProgress(false);
          }}
        ></CommentForm>
      ),
    };

    highlighterUtilsRef.current.setTip(editCommentTip);
    highlighterUtilsRef.current.toggleEditInProgress(true);
  };

  // Scroll to highlight based on hash in the URL
  const scrollToHighlightFromHash = () => {
    const highlightId = parseIdFromHash();
    const highlight = getHighlightById(highlightId);

    if (highlight && highlighterUtilsRef.current) {
      highlighterUtilsRef.current.scrollToHighlight(highlight);
    }
  };

  // Hash listeners for autoscrolling to highlights
  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash);
    };
  }, [scrollToHighlightFromHash]);

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          height: "100vh",
          width: "75vw",
          overflow: "hidden",
          position: "relative",
          flexGrow: 1,
        }}
      >
        <Toolbar
          setPdfScaleValue={(value) => setPdfScaleValue(value)}
          toggleHighlightPen={() => setHighlightPen(!highlightPen)}
        />
        <SearchBar
          onSearch={handleSearch}
          onNavigate={handleSearchNavigation}
          onClear={handleClearSearch}
          currentIndex={currentSearchIndex}
          totalResults={searchResults.length}
          isSearching={isSearching}
        />
        {(() => {
          const document =
            isUsingUploadedPdf && uploadedFileData
              ? new Uint8Array(uploadedFileData)
              : url;
          return document ? (
            <PdfLoader document={document}>
              {(pdfDocument) => (
                <PdfHighlighter
                  enableAreaSelection={(event) => event.altKey}
                  pdfDocument={pdfDocument}
                  onScrollAway={handleScrollAway}
                  utilsRef={(_pdfHighlighterUtils) => {
                    highlighterUtilsRef.current = _pdfHighlighterUtils;
                    // Initialize search service when PDF is ready
                    if (!searchServiceRef.current) {
                      searchServiceRef.current = new SearchService(pdfDocument);
                    } else {
                      searchServiceRef.current.updateDocument(pdfDocument);
                    }
                  }}
                  pdfScaleValue={pdfScaleValue}
                  textSelectionColor={
                    highlightPen ? "rgba(255, 226, 143, 0.8)" : undefined
                  }
                  onSelection={
                    highlightPen
                      ? (selection) =>
                          addHighlight(
                            selection.makeGhostHighlight(),
                            "highlight"
                          )
                      : undefined
                  }
                  selectionTip={
                    highlightPen ? undefined : (
                      <ExpandableTip addHighlight={addHighlight} />
                    )
                  }
                  highlights={[...highlights, ...searchHighlights]}
                  style={{
                    height: "calc(100% - 41px)",
                  }}
                >
                  <HighlightContainer
                    editHighlight={editHighlight}
                    onContextMenu={handleContextMenu}
                    activeCategoryHighlight={activeCategoryHighlight}
                    handleCategoryHighlight={handleCategoryHighlight}
                  />
                </PdfHighlighter>
              )}
            </PdfLoader>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100% - 41px)",
                color: "#666",
                fontSize: "18px",
                textAlign: "center",
                padding: "20px",
              }}
            >
              {isUsingUploadedPdf
                ? "Please upload a PDF file to begin highlighting"
                : "No PDF document available. Please check the URL or upload a file."}
            </div>
          );
        })()}
      </div>

      <Sidebar
        highlights={highlights}
        resetHighlights={resetHighlights}
        toggleDocument={toggleDocument}
        onPdfUpload={handlePdfUpload}
        onClearUpload={handleClearUpload}
        hasUploadedPdf={!!uploadedFile}
        isUsingUploadedPdf={isUsingUploadedPdf}
        handleCategoryHighlight={handleCategoryHighlight}
        activeCategoryHighlight={activeCategoryHighlight}
        navigateToHighlight={navigateToHighlight}
        getCurrentHighlightInfo={getCurrentHighlightInfo}
      />

      {contextMenu && <ContextMenu {...contextMenu} />}
    </div>
  );
};

export default App;
