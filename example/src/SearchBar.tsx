import React, { useState, useEffect, useRef } from "react";
import "./style/SearchBar.css";

export interface SearchResult {
  id: string;
  text: string;
  pageNumber: number;
  position: {
    boundingRect: {
      left: number;
      top: number;
      width: number;
      height: number;
      pageNumber: number;
    };
    rects: Array<{
      left: number;
      top: number;
      width: number;
      height: number;
      pageNumber: number;
    }>;
  };
  scaledPosition: {
    boundingRect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
      pageNumber: number;
    };
    rects: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
      pageNumber: number;
    }>;
    usePdfCoordinates?: boolean;
  };
  matchIndex: number; // Index within the total search results
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  currentIndex: number;
  totalResults: number;
  isSearching: boolean;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onNavigate,
  currentIndex,
  totalResults,
  isSearching,
  onClear
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      onSearch(value.trim());
    } else {
      onClear();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        onNavigate('prev');
      } else {
        onNavigate('next');
      }
    } else if (e.key === 'Escape') {
      handleClear();
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onClear();
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search in PDF... (Ctrl+F)"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="search-clear-btn"
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {searchTerm && (
        <div className="search-controls">
          <div className="search-results-info">
            {isSearching ? (
              <span>Searching...</span>
            ) : totalResults > 0 ? (
              <span>{currentIndex + 1} of {totalResults}</span>
            ) : (
              <span>No results</span>
            )}
          </div>

          <div className="search-navigation">
            <button
              onClick={() => onNavigate('prev')}
              disabled={totalResults === 0 || isSearching}
              className="search-nav-btn"
              title="Previous result (Shift+Enter)"
            >
              ↑
            </button>
            <button
              onClick={() => onNavigate('next')}
              disabled={totalResults === 0 || isSearching}
              className="search-nav-btn"
              title="Next result (Enter)"
            >
              ↓
            </button>
          </div>
        </div>
      )}
    </div>
  );
};