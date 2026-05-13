# Floating UI

Floating UI is a low-level library for positioning floating elements like tooltips, popovers, dropdowns, and menus. It provides anchor positioning to keep floating elements anchored to reference elements while ensuring they stay visible by avoiding collisions with viewport boundaries. The library is platform-agnostic at its core, with specialized packages for DOM, React, React Native, and Vue.

The library offers two main features: anchor positioning (available for all platforms) and user interaction hooks for React that help create accessible floating UI components. Floating UI is the successor to Popper.js and provides a more modular, tree-shakeable architecture with middleware-based positioning logic.

## Core API

### computePosition

The main function that computes x and y coordinates to position a floating element next to a reference element. It accepts middleware functions to modify the positioning behavior.

```javascript
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

const referenceEl = document.querySelector('#button');
const floatingEl = document.querySelector('#tooltip');

// Basic positioning
computePosition(referenceEl, floatingEl, {
  placement: 'top',        // 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | etc.
  strategy: 'absolute',    // 'absolute' | 'fixed'
  middleware: [
    offset(10),            // Add 10px gap between reference and floating
    flip(),                // Flip to opposite side if overflowing
    shift({ padding: 5 }), // Shift along axis to stay in view
  ],
}).then(({ x, y, placement, middlewareData }) => {
  // Apply the computed position
  Object.assign(floatingEl.style, {
    left: `${x}px`,
    top: `${y}px`,
  });

  console.log('Final placement:', placement);  // May differ from initial if flipped
  console.log('Middleware data:', middlewareData);
});
```

### autoUpdate

Automatically updates the floating element position when the reference element moves, resizes, or when scroll/resize events occur. Returns a cleanup function.

```javascript
import { computePosition, autoUpdate, flip, shift } from '@floating-ui/dom';

const referenceEl = document.querySelector('#button');
const floatingEl = document.querySelector('#tooltip');

function updatePosition() {
  computePosition(referenceEl, floatingEl, {
    placement: 'bottom',
    middleware: [flip(), shift()],
  }).then(({ x, y }) => {
    Object.assign(floatingEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  });
}

// Start auto-updating when tooltip becomes visible
const cleanup = autoUpdate(referenceEl, floatingEl, updatePosition, {
  ancestorScroll: true,    // Update on scroll of overflow ancestors
  ancestorResize: true,    // Update on resize of overflow ancestors
  elementResize: true,     // Update when reference/floating elements resize
  layoutShift: true,       // Update on layout shift
  animationFrame: false,   // Update every frame (use for transform animations)
});

// Call cleanup when tooltip is hidden
cleanup();
```

## Middleware

### offset

Adds distance (gap/margin) between the reference and floating elements. Accepts a number or an object for fine-grained control.

```javascript
import { computePosition, offset } from '@floating-ui/dom';

// Simple offset - 10px gap
computePosition(reference, floating, {
  middleware: [offset(10)],
});

// Advanced offset with axes control
computePosition(reference, floating, {
  placement: 'right-start',
  middleware: [
    offset({
      mainAxis: 10,      // Distance along the side (gap)
      crossAxis: 5,      // Skidding along alignment axis
      alignmentAxis: -5, // Override crossAxis for aligned placements
    }),
  ],
});

// Dynamic offset based on state
computePosition(reference, floating, {
  middleware: [
    offset(({ placement, rects }) => {
      // Larger offset for vertical placements
      return placement.startsWith('top') || placement.startsWith('bottom')
        ? 15
        : 10;
    }),
  ],
});
```

### flip

Flips the floating element to the opposite side when it overflows the clipping boundary.

```javascript
import { computePosition, flip } from '@floating-ui/dom';

computePosition(reference, floating, {
  placement: 'top',
  middleware: [
    flip({
      mainAxis: true,                    // Check main axis overflow
      crossAxis: true,                   // Check cross axis overflow
      fallbackPlacements: ['bottom', 'left', 'right'], // Custom fallback order
      fallbackStrategy: 'bestFit',       // 'bestFit' | 'initialPlacement'
      fallbackAxisSideDirection: 'none', // 'none' | 'start' | 'end'
      flipAlignment: true,               // Flip alignment (e.g., top-start to top-end)
      padding: 5,                        // Viewport padding
      boundary: 'clippingAncestors',     // Clipping boundary
    }),
  ],
});

// Simple flip with defaults
computePosition(reference, floating, {
  placement: 'top',
  middleware: [flip()],  // Flips to 'bottom' if 'top' overflows
});
```

### shift

Shifts the floating element along its axis to keep it in view when it overflows.

```javascript
import { computePosition, shift, limitShift } from '@floating-ui/dom';

computePosition(reference, floating, {
  placement: 'top',
  middleware: [
    shift({
      mainAxis: true,     // Shift along alignment axis
      crossAxis: false,   // Shift along side axis
      padding: 5,         // Viewport padding
      boundary: 'clippingAncestors',
      limiter: limitShift({
        offset: 0,        // When limiting starts (positive = earlier)
        mainAxis: true,
        crossAxis: true,
      }),
    }),
  ],
});

// Prevent detachment with limitShift
computePosition(reference, floating, {
  middleware: [
    shift({
      limiter: limitShift({
        offset: ({ rects }) => ({
          mainAxis: rects.reference.height,  // Keep connected to reference
        }),
      }),
    }),
  ],
});
```

### arrow

Provides positioning data for an arrow element that points to the reference.

```javascript
import { computePosition, arrow, offset } from '@floating-ui/dom';

const arrowEl = document.querySelector('#arrow');

computePosition(reference, floating, {
  placement: 'top',
  middleware: [
    offset(10),
    arrow({
      element: arrowEl,
      padding: 5,  // Prevent arrow from touching floating element corners
    }),
  ],
}).then(({ x, y, placement, middlewareData }) => {
  // Position floating element
  Object.assign(floating.style, { left: `${x}px`, top: `${y}px` });

  // Position arrow
  const { x: arrowX, y: arrowY } = middlewareData.arrow;
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]];

  Object.assign(arrowEl.style, {
    left: arrowX != null ? `${arrowX}px` : '',
    top: arrowY != null ? `${arrowY}px` : '',
    [staticSide]: '-4px',  // Half of arrow height
  });
});
```

### size

Provides available width and height to resize the floating element to fit within the boundary.

```javascript
import { computePosition, size, flip } from '@floating-ui/dom';

computePosition(reference, floating, {
  middleware: [
    flip(),
    size({
      apply({ availableWidth, availableHeight, elements, rects }) {
        // Constrain dimensions to available space
        Object.assign(elements.floating.style, {
          maxWidth: `${availableWidth}px`,
          maxHeight: `${availableHeight}px`,
        });
      },
      padding: 10,
    }),
  ],
});

// Match reference width (common for select/combobox)
computePosition(reference, floating, {
  middleware: [
    size({
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
        });
      },
    }),
  ],
});
```

### autoPlacement

Automatically chooses the placement with the most available space.

```javascript
import { computePosition, autoPlacement } from '@floating-ui/dom';

computePosition(reference, floating, {
  middleware: [
    autoPlacement({
      crossAxis: false,               // Consider cross axis overflow
      alignment: 'start',             // Prefer aligned placements
      autoAlignment: true,            // Try opposite alignment if needed
      allowedPlacements: ['top', 'bottom', 'left', 'right'], // Restrict options
    }),
  ],
});
```

### hide

Provides data to hide the floating element when the reference is clipped or escaped.

```javascript
import { computePosition, hide } from '@floating-ui/dom';

computePosition(reference, floating, {
  middleware: [
    hide({ strategy: 'referenceHidden' }),  // Reference scrolled out of view
    hide({ strategy: 'escaped' }),           // Floating escaped clipping boundary
  ],
}).then(({ middlewareData }) => {
  const { referenceHidden } = middlewareData.hide;
  const { escaped } = middlewareData.hide;

  // Hide floating element when reference is hidden
  floating.style.visibility = referenceHidden || escaped ? 'hidden' : 'visible';
});
```

## React Integration

### useFloating Hook

The main React hook that provides positioning and context for interactions.

```jsx
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';
import { useState } from 'react';

function Tooltip() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [
      offset(10),
      flip(),
      shift({ padding: 5 }),
    ],
    whileElementsMounted: autoUpdate,  // Auto-update position
  });

  return (
    <>
      <button
        ref={refs.setReference}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        Hover me
      </button>
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles}>
          Tooltip content
        </div>
      )}
    </>
  );
}
```

### useInteractions Hook

Merges interaction props from multiple hooks into unified prop getters.

```jsx
import {
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react';
import { useState } from 'react';

function TooltipWithInteractions() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { open: 500, close: 0 },  // 500ms delay before opening
    move: true,                       // Open on mouse move
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Hover or focus me
      </button>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          Accessible tooltip
        </div>
      )}
    </>
  );
}
```

### useClick Hook

Opens/closes the floating element on click.

```jsx
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  offset,
  flip,
  autoUpdate,
} from '@floating-ui/react';
import { useState } from 'react';

function Popover() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context, {
    event: 'click',      // 'click' | 'mousedown'
    toggle: true,        // Toggle on repeated clicks
    ignoreMouse: false,  // Ignore mouse if useHover is also used
    keyboardHandlers: true, // Handle Enter/Space keys
  });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        {isOpen ? 'Close' : 'Open'} Popover
      </button>
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <h3>Popover Title</h3>
          <p>Popover content goes here.</p>
        </div>
      )}
    </>
  );
}
```

### useHover Hook

Opens the floating element on hover with configurable delays.

```jsx
import {
  useFloating,
  useInteractions,
  useHover,
  safePolygon,
  offset,
  autoUpdate,
} from '@floating-ui/react';
import { useState } from 'react';

function HoverCard() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(5)],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { open: 300, close: 100 },
    restMs: 150,           // Wait 150ms at rest before opening
    mouseOnly: false,      // Also respond to touch
    move: true,            // Open on mouse move over reference
    handleClose: safePolygon({
      requireIntent: true,
      buffer: 1,           // Pixel buffer around safe polygon
    }),
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <a href="#" ref={refs.setReference} {...getReferenceProps()}>
        Hover for details
      </a>
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <img src="avatar.jpg" alt="User" />
          <p>User profile card with safe polygon hover area</p>
        </div>
      )}
    </>
  );
}
```

### useDismiss Hook

Closes the floating element on escape key or outside press.

```jsx
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  autoUpdate,
} from '@floating-ui/react';
import { useState } from 'react';

function DismissablePopover() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    escapeKey: true,           // Close on Escape
    outsidePress: true,        // Close on outside click
    outsidePressEvent: 'pointerdown', // 'pointerdown' | 'mousedown' | 'click'
    referencePress: false,     // Close when clicking reference
    ancestorScroll: false,     // Close when scrolling ancestor
    bubbles: true,             // Allow event bubbling in nested floats
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Open
      </button>
      {isOpen && (
        <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          Press Escape or click outside to close
        </div>
      )}
    </>
  );
}
```

### FloatingPortal Component

Portals the floating element outside the app root to avoid clipping issues.

```jsx
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  FloatingPortal,
  FloatingOverlay,
  autoUpdate,
} from '@floating-ui/react';
import { useState } from 'react';

function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Open Modal
      </button>
      {isOpen && (
        <FloatingPortal id="modal-root">
          <FloatingOverlay lockScroll style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div
              ref={refs.setFloating}
              style={{
                ...floatingStyles,
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
              }}
              {...getFloatingProps()}
            >
              <h2>Modal Title</h2>
              <p>Modal content portaled to document body.</p>
              <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </>
  );
}
```

### FloatingFocusManager Component

Provides focus management with focus trapping for modal dialogs.

```jsx
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  FloatingPortal,
  FloatingFocusManager,
  autoUpdate,
} from '@floating-ui/react';
import { useState } from 'react';

function Dialog() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'dialog' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Open Dialog
      </button>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            modal={true}              // Trap focus inside
            initialFocus={0}          // Focus first tabbable element
            returnFocus={true}        // Return focus on close
            guards={true}             // Render focus guard elements
            closeOnFocusOut={true}    // Close when focus leaves (non-modal)
          >
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <h2>Accessible Dialog</h2>
              <input placeholder="First focusable element" />
              <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
```

### FloatingArrow Component

Renders a customizable arrow pointing to the reference element.

```jsx
import {
  useFloating,
  useInteractions,
  useHover,
  arrow,
  offset,
  FloatingArrow,
  autoUpdate,
} from '@floating-ui/react';
import { useState, useRef } from 'react';

function TooltipWithArrow() {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [
      offset(10),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Hover me
      </button>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            background: '#333',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
          }}
          {...getFloatingProps()}
        >
          Tooltip with arrow
          <FloatingArrow
            ref={arrowRef}
            context={context}
            width={12}
            height={6}
            tipRadius={2}
            fill="#333"
          />
        </div>
      )}
    </>
  );
}
```

## Vue Integration

### useFloating Composable

Vue composable for positioning floating elements with reactive updates.

```vue
<script setup>
import { ref } from 'vue';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/vue';

const reference = ref(null);
const floating = ref(null);
const isOpen = ref(false);

const { floatingStyles, placement } = useFloating(reference, floating, {
  placement: 'bottom',
  middleware: [offset(10), flip(), shift()],
  whileElementsMounted: autoUpdate,
  open: isOpen,
});
</script>

<template>
  <button
    ref="reference"
    @mouseenter="isOpen = true"
    @mouseleave="isOpen = false"
  >
    Hover me
  </button>
  <div
    v-if="isOpen"
    ref="floating"
    :style="floatingStyles"
    class="tooltip"
  >
    Tooltip positioned at {{ placement }}
  </div>
</template>

<style>
.tooltip {
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
}
</style>
```

### Arrow with Vue

Using the arrow middleware with Vue's template refs.

```vue
<script setup>
import { ref } from 'vue';
import {
  useFloating,
  arrow as arrowMiddleware,
  offset,
  autoUpdate,
} from '@floating-ui/vue';

const reference = ref(null);
const floating = ref(null);
const arrowEl = ref(null);
const isOpen = ref(false);

const { floatingStyles, middlewareData, placement } = useFloating(
  reference,
  floating,
  {
    placement: 'top',
    middleware: [
      offset(10),
      arrowMiddleware({ element: arrowEl }),
    ],
    whileElementsMounted: autoUpdate,
  }
);
</script>

<template>
  <button
    ref="reference"
    @click="isOpen = !isOpen"
  >
    Toggle tooltip
  </button>
  <div
    v-if="isOpen"
    ref="floating"
    :style="floatingStyles"
    class="tooltip"
  >
    Vue tooltip with arrow
    <div
      ref="arrowEl"
      class="arrow"
      :style="{
        left: middlewareData.arrow?.x != null
          ? `${middlewareData.arrow.x}px`
          : '',
        top: middlewareData.arrow?.y != null
          ? `${middlewareData.arrow.y}px`
          : '',
        [placement.split('-')[0] === 'top' ? 'bottom' : 'top']: '-4px',
      }"
    />
  </div>
</template>

<style>
.tooltip {
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  position: relative;
}
.arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #333;
  transform: rotate(45deg);
}
</style>
```

## Summary

Floating UI provides a comprehensive solution for positioning floating elements across different platforms and frameworks. The core library offers the `computePosition` function with a flexible middleware system including `offset`, `flip`, `shift`, `arrow`, `size`, `autoPlacement`, and `hide` middleware. The `autoUpdate` function ensures positions stay synchronized with reference elements during scrolling, resizing, and layout changes.

For React applications, Floating UI provides a rich ecosystem of hooks and components: `useFloating` for positioning, `useInteractions` for composing interaction handlers, `useHover`/`useClick`/`useFocus`/`useDismiss` for common interaction patterns, and components like `FloatingPortal`, `FloatingFocusManager`, and `FloatingArrow` for accessibility and visual presentation. Vue developers can use the `useFloating` composable with the same middleware system. The library is designed to be tree-shakeable, allowing developers to import only what they need, and all APIs follow platform conventions for a natural developer experience.
