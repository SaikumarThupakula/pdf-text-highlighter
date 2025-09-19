// Example backend API implementation for text highlighting
// This shows how your backend should structure the response

export interface BackendHighlightResponse {
  highlights: BackendHighlightData[];
  metadata?: {
    pdfUrl: string;
    totalHighlights: number;
    categories: string[];
  };
}

export interface BackendHighlightData {
  text: string;
  pageNumber: number;
  comment?: string;
  category?: string;
  color?: string;
  priority?: 'high' | 'medium' | 'low';
  // Coordinates provided by backend
  coordinates?: {
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
  };
}

// Example API endpoint implementation (Node.js/Express)
export const exampleAPIEndpoint = `
// Express.js example
app.get('/api/highlights/:pdfId', async (req, res) => {
  try {
    const { pdfId } = req.params;
    
    // Fetch highlights from your database
    const highlights = await getHighlightsForPDF(pdfId);
    
    // Process and format the data
    const response: BackendHighlightResponse = {
      highlights: highlights.map(highlight => ({
        text: highlight.extractedText,
        pageNumber: highlight.pageNumber,
        comment: highlight.annotation,
        category: highlight.category,
        color: getColorForCategory(highlight.category),
        priority: highlight.priority,
        coordinates: {
          boundingRect: {
            x1: highlight.x1,
            y1: highlight.y1,
            x2: highlight.x2,
            y2: highlight.y2,
            width: highlight.width,
            height: highlight.height,
            pageNumber: highlight.pageNumber
          },
          rects: highlight.rects || [{
            x1: highlight.x1,
            y1: highlight.y1,
            x2: highlight.x2,
            y2: highlight.y2,
            width: highlight.width,
            height: highlight.height,
            pageNumber: highlight.pageNumber
          }]
        }
      })),
      metadata: {
        pdfUrl: highlight.pdfUrl,
        totalHighlights: highlights.length,
        categories: [...new Set(highlights.map(h => h.category))]
      }
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch highlights' });
  }
});
`;

// Example database schema
export const exampleDatabaseSchema = `
-- PostgreSQL example
CREATE TABLE pdf_highlights (
  id SERIAL PRIMARY KEY,
  pdf_id VARCHAR(255) NOT NULL,
  extracted_text TEXT NOT NULL,
  page_number INTEGER NOT NULL,
  annotation TEXT,
  category VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'medium',
  -- Coordinate fields
  x1 DECIMAL(10,2),
  y1 DECIMAL(10,2),
  x2 DECIMAL(10,2),
  y2 DECIMAL(10,2),
  width DECIMAL(10,2),
  height DECIMAL(10,2),
  rects JSONB, -- For multiple rectangles
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient queries
CREATE INDEX idx_pdf_highlights_pdf_id ON pdf_highlights(pdf_id);
CREATE INDEX idx_pdf_highlights_page ON pdf_highlights(page_number);
`;

// Example Python/FastAPI implementation
export const examplePythonAPI = `
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class HighlightData(BaseModel):
    text: str
    pageNumber: int
    comment: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None

class HighlightResponse(BaseModel):
    highlights: List[HighlightData]
    metadata: Optional[dict] = None

@app.get("/api/highlights/{pdf_id}", response_model=HighlightResponse)
async def get_highlights(pdf_id: str):
    try:
        # Fetch from your database
        highlights = await fetch_highlights_from_db(pdf_id)
        
        return HighlightResponse(
            highlights=[
                HighlightData(
                    text=hl.extracted_text,
                    pageNumber=hl.page_number,
                    comment=hl.annotation,
                    category=hl.category,
                    color=get_color_for_category(hl.category)
                ) for hl in highlights
            ],
            metadata={
                "pdfUrl": f"https://your-cdn.com/pdfs/{pdf_id}.pdf",
                "totalHighlights": len(highlights),
                "categories": list(set(hl.category for hl in highlights if hl.category))
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
`;

// Example usage in your frontend
export const exampleFrontendUsage = `
import BackendTextHighlighter from './BackendTextHighlighter';

// Method 1: Using API URL
const loadHighlightsFromAPI = async () => {
  await BackendTextHighlighter.createHighlightsFromAPI(
    'https://your-api.com/highlights/pdf-123',
    'https://your-cdn.com/pdfs/document.pdf',
    (highlight, comment) => {
      // Add highlight to your state
      setHighlights(prev => [...prev, { ...highlight, comment }]);
    }
  );
};

// Method 2: Using static data
const loadHighlightsFromData = async () => {
  const backendData = {
    pdfUrl: 'https://your-cdn.com/pdfs/document.pdf',
    highlights: [
      {
        text: "Important finding",
        pageNumber: 1,
        comment: "This is a key insight",
        category: "findings",
        color: "#ffeb3b"
      }
    ]
  };

  await BackendTextHighlighter.createHighlightsFromBackendData(
    backendData,
    (highlight, comment) => {
      setHighlights(prev => [...prev, { ...highlight, comment }]);
    }
  );
};
`;

export default {
  exampleAPIEndpoint,
  exampleDatabaseSchema,
  examplePythonAPI,
  exampleFrontendUsage
};
