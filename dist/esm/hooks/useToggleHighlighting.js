import { useState, useCallback, useMemo, useEffect, useRef } from "react";
/**
 * Hook for managing toggle-based highlighting system with visibility fixes
 */
export const useToggleHighlighting = (extractedTexts = [], ictCodes = [], codes = [], defaultTexts = []) => {
    const [highlightMode, setHighlightMode] = useState("none");
    const [selectedDefaultTextId, setSelectedDefaultTextId] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const timeoutRef = useRef();
    // Force re-render to fix visibility issues
    const triggerUpdate = useCallback(() => {
        setForceUpdate(prev => prev + 1);
    }, []);
    // Create highlights for extracted texts
    const extractedTextHighlights = useMemo(() => {
        return extractedTexts.map((text) => ({
            id: `extracted-${text.id}`,
            type: "text",
            category: "extracted-text",
            content: { text: text.text },
            position: text.position,
        }));
    }, [extractedTexts, forceUpdate]); // Include forceUpdate to trigger re-render
    // Create highlights for ICT codes (only those with positions)
    const ictCodeHighlights = useMemo(() => {
        return ictCodes
            .filter(code => code.position) // Only codes found in PDF
            .map((code) => ({
            id: `ict-${code.id}`,
            type: "text",
            category: "ict-code",
            content: { text: code.code },
            position: code.position,
        }));
    }, [ictCodes, forceUpdate]); // Include forceUpdate to trigger re-render
    // Create highlights for codes
    const codesHighlights = useMemo(() => {
        return codes.map((code) => ({
            id: `codes-${code.id}`,
            type: "text",
            category: "codes",
            content: { text: code.text },
            position: code.position,
        }));
    }, [codes, forceUpdate]); // Include forceUpdate to trigger re-render
    // Create highlight for selected default text
    const defaultTextHighlight = useMemo(() => {
        if (!selectedDefaultTextId)
            return [];
        const selectedText = defaultTexts.find(text => text.id === selectedDefaultTextId);
        if (!selectedText)
            return [];
        return [{
                id: `default-${selectedText.id}`,
                type: "text",
                content: { text: selectedText.text },
                position: selectedText.position,
            }];
    }, [defaultTexts, selectedDefaultTextId, forceUpdate]); // Include forceUpdate to trigger re-render
    // Get current highlights based on mode
    const currentHighlights = useMemo(() => {
        switch (highlightMode) {
            case "extracted-text":
                return extractedTextHighlights;
            case "ict-code":
                return ictCodeHighlights;
            case "codes":
                return codesHighlights;
            case "default-text":
                return defaultTextHighlight;
            case "none":
            default:
                return [];
        }
    }, [highlightMode, extractedTextHighlights, ictCodeHighlights, codesHighlights, defaultTextHighlight]);
    // Delayed update to fix rendering issues
    const scheduleUpdate = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            triggerUpdate();
        }, 100); // Small delay to ensure PDF is rendered
    }, [triggerUpdate]);
    // Toggle extracted text highlights
    const toggleExtractedText = useCallback(() => {
        const newMode = highlightMode === "extracted-text" ? "none" : "extracted-text";
        setHighlightMode(newMode);
        setSelectedDefaultTextId(null); // Clear default text selection
        scheduleUpdate(); // Force update after mode change
    }, [highlightMode, scheduleUpdate]);
    // Toggle ICT code highlights
    const toggleICTCodes = useCallback(() => {
        const newMode = highlightMode === "ict-code" ? "none" : "ict-code";
        setHighlightMode(newMode);
        setSelectedDefaultTextId(null); // Clear default text selection
        scheduleUpdate(); // Force update after mode change
    }, [highlightMode, scheduleUpdate]);
    // Toggle codes highlights
    const toggleCodes = useCallback(() => {
        const newMode = highlightMode === "codes" ? "none" : "codes";
        setHighlightMode(newMode);
        setSelectedDefaultTextId(null); // Clear default text selection
        scheduleUpdate(); // Force update after mode change
    }, [highlightMode, scheduleUpdate]);
    // Handle default text tap - show only that text highlighted
    const handleDefaultTextTap = useCallback((textId) => {
        if (selectedDefaultTextId === textId && highlightMode === "default-text") {
            // If same text is tapped again, clear highlights
            setHighlightMode("none");
            setSelectedDefaultTextId(null);
        }
        else {
            // Show only this text highlighted
            setHighlightMode("default-text");
            setSelectedDefaultTextId(textId);
        }
        scheduleUpdate(); // Force update after mode change
    }, [selectedDefaultTextId, highlightMode, scheduleUpdate]);
    // Clear all highlights
    const clearAllHighlights = useCallback(() => {
        setHighlightMode("none");
        setSelectedDefaultTextId(null);
        scheduleUpdate(); // Force update after clearing
    }, [scheduleUpdate]);
    // Get available ICT codes (those found in PDF)
    const availableICTCodes = useMemo(() => {
        return ictCodes.filter(code => code.position);
    }, [ictCodes]);
    // Get unavailable ICT codes (those not found in PDF)
    const unavailableICTCodes = useMemo(() => {
        return ictCodes.filter(code => !code.position);
    }, [ictCodes]);
    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    // Force update when highlights change to ensure visibility
    useEffect(() => {
        if (currentHighlights.length > 0) {
            scheduleUpdate();
        }
    }, [currentHighlights.length, scheduleUpdate]);
    return {
        // Current state
        highlightMode,
        currentHighlights,
        selectedDefaultTextId,
        // Data
        extractedTexts,
        ictCodes,
        codes,
        defaultTexts,
        availableICTCodes,
        unavailableICTCodes,
        // Actions
        toggleExtractedText,
        toggleICTCodes,
        toggleCodes,
        handleDefaultTextTap,
        clearAllHighlights,
        triggerUpdate, // Expose for manual updates
        // Computed states
        isExtractedTextActive: highlightMode === "extracted-text",
        isICTCodesActive: highlightMode === "ict-code",
        isCodesActive: highlightMode === "codes",
        isDefaultTextActive: highlightMode === "default-text",
        hasExtractedTexts: extractedTexts.length > 0,
        hasAvailableICTCodes: availableICTCodes.length > 0,
        hasCodes: codes.length > 0,
    };
};
//# sourceMappingURL=useToggleHighlighting.js.map