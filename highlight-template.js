// Template for creating text highlights for uploaded PDFs
// Copy and modify these coordinates for your specific text positions

const highlightTemplate = {
  content: {
    text: "Your text content here - the actual text you want to highlight",
  },
  type: "text",
  position: {
    boundingRect: {
      x1: 50,        // Left edge X coordinate
      y1: 200,       // Top edge Y coordinate
      x2: 500,       // Right edge X coordinate
      y2: 220,       // Bottom edge Y coordinate
      width: 595,    // Page width (usually 595 for A4)
      height: 842,   // Page height (usually 842 for A4)
      pageNumber: 1, // Page number (1-indexed)
    },
    rects: [
      {
        x1: 50,        // Same coordinates as boundingRect for single-line text
        y1: 200,
        x2: 500,
        y2: 220,
        width: 595,
        height: 842,
        pageNumber: 1,
      },
      // For multi-line text, add more rect objects:
      // {
      //   x1: 50,
      //   y1: 220,
      //   x2: 500,
      //   y2: 240,
      //   width: 595,
      //   height: 842,
      //   pageNumber: 1,
      // },
    ],
  },
  comment: "Your comment about this highlight",
  id: "unique-highlight-id",
};

// Example array of highlights for an uploaded PDF:
const myHighlights = [
  {
    content: {
      text: "Section I: Important medical information",
    },
    type: "text",
    position: {
      boundingRect: {
        x1: 50,
        y1: 200,
        x2: 500,
        y2: 220,
        width: 595,
        height: 842,
        pageNumber: 1,
      },
      rects: [
        {
          x1: 50,
          y1: 200,
          x2: 500,
          y2: 220,
          width: 595,
          height: 842,
          pageNumber: 1,
        },
      ],
    },
    comment: "Medical Section Header",
    id: "medical-section-1",
  },
  {
    content: {
      text: "Multi-line text example that spans across multiple lines in the PDF document",
    },
    type: "text",
    position: {
      boundingRect: {
        x1: 50,
        y1: 240,
        x2: 500,
        y2: 280,
        width: 595,
        height: 842,
        pageNumber: 1,
      },
      rects: [
        {
          x1: 50,
          y1: 240,
          x2: 500,
          y2: 260,
          width: 595,
          height: 842,
          pageNumber: 1,
        },
        {
          x1: 50,
          y1: 260,
          x2: 400,
          y2: 280,
          width: 595,
          height: 842,
          pageNumber: 1,
        },
      ],
    },
    comment: "Multi-line text example",
    id: "multi-line-text",
  },
];

// To use these highlights in your app:
// 1. Copy this template
// 2. Modify the coordinates (x1, y1, x2, y2) to match your PDF text positions
// 3. Update the text content and comments
// 4. Add the highlights array to your app state: setHighlights(myHighlights)