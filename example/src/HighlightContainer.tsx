import React, { MouseEvent } from "react";
import HighlightPopup from "./HighlightPopup";
import {
  AreaHighlight,
  MonitoredHighlightContainer,
  TextHighlight,
  Tip,
  ViewportHighlight,
  useHighlightContainerContext,
  usePdfHighlighterContext,
} from "./react-pdf-highlighter-extended";
import { CommentedHighlight } from "./types";

interface HighlightContainerProps {
  editHighlight: (
    idToUpdate: string,
    edit: Partial<CommentedHighlight>,
  ) => void;
  onContextMenu?: (
    event: MouseEvent<HTMLDivElement>,
    highlight: ViewportHighlight<CommentedHighlight>,
  ) => void;
  activeCategoryHighlight?: "extracted-text" | "extracted-code" | "text+code" | "ict-code" | null;
  handleCategoryHighlight?: (highlight: CommentedHighlight) => void;
}

const HighlightContainer = ({
  editHighlight,
  onContextMenu,
  activeCategoryHighlight,
  handleCategoryHighlight,
}: HighlightContainerProps) => {
  const {
    highlight,
    viewportToScaled,
    screenshot,
    isScrolledTo,
    highlightBindings,
  } = useHighlightContainerContext<CommentedHighlight>();

  const { toggleEditInProgress } = usePdfHighlighterContext();

  // Check if this highlight should show category colors
  // Show colors when scrolled to (for all highlights) or when category matches active category
  const shouldShowCategoryColor = Boolean(
    isScrolledTo ||
    (highlight.category && activeCategoryHighlight === highlight.category)
  );


  // Check if this is a search highlight
  const isSearchHighlight = highlight.id.startsWith('search-');

  // Get search highlight specific styles
  const getSearchHighlightStyle = () => {
    if (!isSearchHighlight) return undefined;

    // Check if this is the current search result
    const isCurrentSearchResult = isScrolledTo;

    return {
      backgroundColor: isCurrentSearchResult ? '#ff9800' : '#ffeb3b',
      border: isCurrentSearchResult ? '2px solid #f57c00' : '1px solid #fdd835',
      borderRadius: '2px',
      boxShadow: isCurrentSearchResult ? '0 0 0 2px #f57c00' : '0 0 0 1px #fdd835'
    };
  };

  const component = highlight.type === "text" ? (
    <TextHighlight
      isScrolledTo={isScrolledTo}
      highlight={highlight}
      showCategoryColor={shouldShowCategoryColor}
      style={getSearchHighlightStyle()}
      onContextMenu={(event) =>
        onContextMenu && onContextMenu(event, highlight)
      }
      onClick={() => {
        if (handleCategoryHighlight) {
          handleCategoryHighlight(highlight);
        }
      }}
    />
  ) : (
    <AreaHighlight
      isScrolledTo={isScrolledTo}
      highlight={highlight}
      showCategoryColor={shouldShowCategoryColor}
      style={getSearchHighlightStyle()}
      onChange={(boundingRect) => {
        const edit = {
          position: {
            boundingRect: viewportToScaled(boundingRect),
            rects: [],
          },
          content: {
            image: screenshot(boundingRect),
          },
        };

        editHighlight(highlight.id, edit);
        toggleEditInProgress(false);
      }}
      bounds={highlightBindings.textLayer}
      onContextMenu={(event) =>
        onContextMenu && onContextMenu(event, highlight)
      }
      onEditStart={() => toggleEditInProgress(true)}
      onClick={() => {
        if (handleCategoryHighlight) {
          handleCategoryHighlight(highlight);
        }
      }}
    />
  );

  const highlightTip: Tip = {
    position: highlight.position,
    content: <HighlightPopup highlight={highlight} />,
  };

  return (
    <MonitoredHighlightContainer
      highlightTip={highlightTip}
      key={highlight.id}
      children={component}
    />
  );
};

export default HighlightContainer;
