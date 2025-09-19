import type { Highlight, ScaledPosition } from "../types";
/**
 * Interface for extracted text data
 */
export interface ExtractedText {
    id: string;
    text: string;
    position: ScaledPosition;
}
/**
 * Interface for ICT code data
 */
export interface ICTCode {
    id: string;
    code: string;
    description: string;
    position?: ScaledPosition;
}
/**
 * Interface for codes data (similar to extracted text but different category)
 */
export interface Code {
    id: string;
    text: string;
    position: ScaledPosition;
}
/**
 * Interface for default text that can be highlighted
 */
export interface DefaultText {
    id: string;
    text: string;
    position: ScaledPosition;
}
/**
 * Highlight mode - determines which highlights are visible
 */
export type HighlightMode = "none" | "extracted-text" | "ict-code" | "codes" | "default-text";
/**
 * Hook for managing toggle-based highlighting system with visibility fixes
 */
export declare const useToggleHighlighting: (extractedTexts?: ExtractedText[], ictCodes?: ICTCode[], codes?: Code[], defaultTexts?: DefaultText[]) => {
    highlightMode: HighlightMode;
    currentHighlights: Highlight[];
    selectedDefaultTextId: string | null;
    extractedTexts: ExtractedText[];
    ictCodes: ICTCode[];
    codes: Code[];
    defaultTexts: DefaultText[];
    availableICTCodes: ICTCode[];
    unavailableICTCodes: ICTCode[];
    toggleExtractedText: () => void;
    toggleICTCodes: () => void;
    toggleCodes: () => void;
    handleDefaultTextTap: (textId: string) => void;
    clearAllHighlights: () => void;
    triggerUpdate: () => void;
    isExtractedTextActive: boolean;
    isICTCodesActive: boolean;
    isCodesActive: boolean;
    isDefaultTextActive: boolean;
    hasExtractedTexts: boolean;
    hasAvailableICTCodes: boolean;
    hasCodes: boolean;
};
