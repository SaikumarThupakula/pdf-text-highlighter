import { PdfHighlighter, } from "./components/PdfHighlighter";
import { TextHighlight } from "./components/TextHighlight";
import { MonitoredHighlightContainer, } from "./components/MonitoredHighlightContainer";
import { AreaHighlight } from "./components/AreaHighlight";
import { PdfLoader } from "./components/PdfLoader";
import { CategorizedTextHighlight, } from "./components/CategorizedTextHighlight";
import { CategorizedHighlightContainer, } from "./components/CategorizedHighlightContainer";
import { useHighlightContainerContext, } from "./contexts/HighlightContext";
import { viewportPositionToScaled, scaledPositionToViewport, } from "./lib/coordinates";
import { getHighlightColors, getHighlightStyle, HIGHLIGHT_COLORS, } from "./lib/highlight-colors";
import { useToggleHighlighting } from "./hooks/useToggleHighlighting";
import { useHighlightNavigation } from "./hooks/useHighlightNavigation";
import { HighlightNavigationControls } from "./components/HighlightNavigationControls";
import { NavigableHighlightSidebar } from "./components/NavigableHighlightSidebar";
import { usePdfHighlighterContext, } from "./contexts/PdfHighlighterContext";
export { PdfHighlighter, PdfLoader, TextHighlight, MonitoredHighlightContainer, AreaHighlight, CategorizedTextHighlight, CategorizedHighlightContainer, HighlightNavigationControls, NavigableHighlightSidebar, useHighlightContainerContext, viewportPositionToScaled, scaledPositionToViewport, usePdfHighlighterContext, getHighlightColors, getHighlightStyle, HIGHLIGHT_COLORS, useToggleHighlighting, useHighlightNavigation, };
export * from "./types";
//# sourceMappingURL=index.js.map