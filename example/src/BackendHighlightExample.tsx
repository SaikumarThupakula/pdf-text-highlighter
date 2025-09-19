import React, { useEffect, useState } from 'react';
import { PdfHighlighter, PdfLoader, Highlight, CommentedHighlight } from './react-pdf-highlighter-extended';
import BackendTextHighlighter, { BackendHighlightData } from './BackendTextHighlighter';
import HighlightContainer from './HighlightContainer';

interface BackendHighlightExampleProps {
  pdfUrl: string;
  apiUrl?: string;
  backendHighlights?: BackendHighlightData[];
}

const BackendHighlightExample: React.FC<BackendHighlightExampleProps> = ({
  pdfUrl,
  apiUrl,
  backendHighlights
}) => {
  const [highlights, setHighlights] = useState<CommentedHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to add highlight from backend data
  const addBackendHighlight = (highlight: Highlight, comment: string) => {
    const newHighlight: CommentedHighlight = {
      ...highlight,
      comment,
      id: highlight.id
    };
    
    setHighlights(prev => [...prev, newHighlight]);
  };

  // Load highlights from backend
  useEffect(() => {
    const loadBackendHighlights = async () => {
      if (!pdfUrl) return;

      setIsLoading(true);
      
      try {
        if (apiUrl) {
          // Load from API
          await BackendTextHighlighter.createHighlightsFromAPI(
            apiUrl,
            pdfUrl,
            addBackendHighlight
          );
        } else if (backendHighlights) {
          // Load from provided data
          await BackendTextHighlighter.createHighlightsFromBackendData(
            {
              pdfUrl,
              highlights: backendHighlights
            },
            addBackendHighlight
          );
        }
      } catch (error) {
        console.error('Failed to load backend highlights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Wait for PDF to be loaded before creating highlights
    const timer = setTimeout(loadBackendHighlights, 1000);
    return () => clearTimeout(timer);
  }, [pdfUrl, apiUrl, backendHighlights]);

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            Loading highlights from backend...
          </div>
        )}
        
        <PdfLoader document={pdfUrl}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              highlights={highlights}
              style={{ height: '100%' }}
            >
              <HighlightContainer />
            </PdfHighlighter>
          )}
        </PdfLoader>
      </div>
    </div>
  );
};

export default BackendHighlightExample;
