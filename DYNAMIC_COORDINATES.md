# Dynamic Coordinate System

## Overview

The PDF highlighter now uses a dynamic coordinate system instead of hardcoded absolute coordinates. This makes highlights more robust and adaptable to different PDF sizes, zoom levels, and screen dimensions.

## Key Features

### 1. Percentage-Based Coordinates
Instead of hardcoded pixel coordinates, highlights are now defined using percentage-based positions (0-1 range):

```typescript
{
  text: "Sample highlight text",
  page: 1,
  startX: 0.1,  // 10% from left edge
  startY: 0.2,  // 20% from top edge
  endX: 0.5,    // 50% from left edge
  endY: 0.25,   // 25% from top edge
}
```

### 2. Automatic Scaling
When the PDF is zoomed or resized, highlight coordinates automatically adjust to maintain their relative positions on the page.

### 3. Dynamic Generation
Highlights are generated at runtime based on configuration, making them easier to maintain and modify.

## Implementation

### Core Files
- `example/src/dynamic-highlights.ts` - Contains the dynamic highlight generation logic
- `example/src/App.tsx` - Updated to use dynamic highlights and handle scale changes

### Key Functions

#### `generateDynamicHighlights(pdfUrl, pageWidth?, pageHeight?)`
Generates highlight objects with absolute coordinates based on percentage-based configuration.

#### `updateHighlightCoordinates(highlights, oldWidth, oldHeight, newWidth, newHeight)`
Updates existing highlights when PDF dimensions change.

#### `getDynamicHighlights(pdfUrl)`
Convenience function to get dynamic highlights for a given PDF URL.

## Usage

### Adding New Highlights
To add new highlights, update the `dynamicHighlightConfigs` object in `dynamic-highlights.ts`:

```typescript
const dynamicHighlightConfigs: Record<string, DynamicHighlightConfig[]> = {
  "your-pdf-url": [
    {
      text: "Text to highlight",
      comment: "Your comment",
      page: 1,
      startX: 0.1,  // 10% from left
      startY: 0.2,  // 20% from top
      endX: 0.5,    // 50% from left
      endY: 0.25,   // 25% from top
    }
  ]
};
```

### Custom Page Dimensions
If you know the exact PDF page dimensions, you can specify them:

```typescript
const highlights = generateDynamicHighlights(pdfUrl, 612, 792); // Letter size
```

## Benefits

1. **Responsive**: Highlights maintain their relative positions regardless of zoom level
2. **Maintainable**: Easy to add, modify, or remove highlights
3. **Flexible**: Works with different PDF sizes and formats
4. **Future-proof**: Can be enhanced to detect actual PDF dimensions automatically

## Migration from Static Coordinates

The old `test-highlights.ts` file with hardcoded coordinates is still available but no longer used by default. The new system provides equivalent functionality with better flexibility.

To switch back to static coordinates temporarily, change the import in `App.tsx`:

```typescript
// Dynamic (new)
import { getDynamicHighlights } from "./dynamic-highlights";

// Static (old)
import { testHighlights as _testHighlights } from "./test-highlights";
```

## Future Enhancements

1. **Auto-detection**: Automatically detect PDF page dimensions
2. **Text-based positioning**: Position highlights based on text content rather than coordinates
3. **Responsive layouts**: Adapt to different screen sizes and orientations
4. **Visual editor**: GUI for creating and editing highlight positions