import React, { useState } from 'react';
import BackendHighlightExample from './BackendHighlightExample';
import { BackendHighlightData } from './BackendTextHighlighter';

const BackendIntegrationExample: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState('https://arxiv.org/pdf/2203.11115');
  const [apiUrl, setApiUrl] = useState('');
  const [useApi, setUseApi] = useState(false);

  // Example backend highlight data with coordinates
  const exampleBackendHighlights: BackendHighlightData[] = [
    {
      text: "The analysis indicates that TS applications exhibit significantly better code quality",
      pageNumber: 1,
      comment: "Key finding about TypeScript benefits",
      category: "findings",
      color: "#ffeb3b",
      coordinates: {
        boundingRect: {
          x1: 57.39482116699219,
          y1: 353.2035827636719,
          x2: 264.80804443359375,
          y2: 362.2035827636719,
          width: 551,
          height: 713.0588235294117,
          pageNumber: 1
        },
        rects: [
          {
            x1: 57.39482116699219,
            y1: 353.2035827636719,
            x2: 264.80804443359375,
            y2: 362.2035827636719,
            width: 551,
            height: 713.0588235294117,
            pageNumber: 1
          }
        ]
      }
    },
    {
      text: "than JS applications",
      pageNumber: 1,
      comment: "Comparison with JavaScript",
      category: "comparison",
      color: "#4caf50",
      coordinates: {
        boundingRect: {
          x1: 48.42552185058594,
          y1: 363.0717468261719,
          x2: 248.294189453125,
          y2: 372.0717468261719,
          width: 551,
          height: 713.0588235294117,
          pageNumber: 1
        },
        rects: [
          {
            x1: 48.42552185058594,
            y1: 363.0717468261719,
            x2: 248.294189453125,
            y2: 372.0717468261719,
            width: 551,
            height: 713.0588235294117,
            pageNumber: 1
          }
        ]
      }
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Backend Text Highlighting Example</h1>
      
      <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Configuration</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            PDF URL: 
            <input 
              type="text" 
              value={pdfUrl} 
              onChange={(e) => setPdfUrl(e.target.value)}
              style={{ width: '400px', marginLeft: '10px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            <input 
              type="checkbox" 
              checked={useApi} 
              onChange={(e) => setUseApi(e.target.checked)}
            />
            Use API URL instead of static data
          </label>
        </div>

        {useApi && (
          <div style={{ marginBottom: '10px' }}>
            <label>
              API URL: 
              <input 
                type="text" 
                value={apiUrl} 
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://your-api.com/highlights"
                style={{ width: '400px', marginLeft: '10px' }}
              />
            </label>
          </div>
        )}

        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <p><strong>Example API Response Format (with coordinates):</strong></p>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
{`{
  "highlights": [
    {
      "text": "Text to highlight",
      "pageNumber": 1,
      "comment": "Your comment",
      "category": "optional",
      "color": "#ffeb3b",
      "coordinates": {
        "boundingRect": {
          "x1": 57.39,
          "y1": 353.20,
          "x2": 264.80,
          "y2": 362.20,
          "width": 551,
          "height": 713.05,
          "pageNumber": 1
        },
        "rects": [
          {
            "x1": 57.39,
            "y1": 353.20,
            "x2": 264.80,
            "y2": 362.20,
            "width": 551,
            "height": 713.05,
            "pageNumber": 1
          }
        ]
      }
    }
  ]
}`}
          </pre>
        </div>
      </div>

      <div style={{ height: '80vh', border: '1px solid #ddd', borderRadius: '8px' }}>
        <BackendHighlightExample
          pdfUrl={pdfUrl}
          apiUrl={useApi ? apiUrl : undefined}
          backendHighlights={useApi ? undefined : exampleBackendHighlights}
        />
      </div>
    </div>
  );
};

export default BackendIntegrationExample;
