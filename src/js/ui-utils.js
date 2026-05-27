/**
 * UI Utilities for Reactive UI & State Management (Phase 4)
 * 
 * Includes:
 * 1. A lightweight Proxy-based Store for reactivity without heavy frameworks.
 * 2. A DOM Diffing helper for efficient list updates (avoids innerHTML thrashing).
 */

// --- 1. Lightweight Reactive Store ---
export class Store {
  constructor(initialState = {}) {
    this.subscribers = new Set();
    
    // Create a Proxy to intercept property changes
    this.state = new Proxy(initialState, {
      set: (target, property, value) => {
        if (target[property] !== value) {
          target[property] = value;
          this.notify(property, value);
        }
        return true;
      }
    });
  }

  // Subscribe to changes on a specific key or '*' for all keys
  subscribe(key, callback) {
    const subscriber = { key, callback };
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber); // Unsubscribe function
  }

  notify(key, value) {
    this.subscribers.forEach(sub => {
      if (sub.key === key || sub.key === '*') {
        sub.callback(value, key, this.state);
      }
    });
  }
}

// --- 2. Lightweight DOM Diffing Helper ---
/**
 * Efficiently updates a container with a new list of items without destroying the whole DOM.
 * It matches existing elements to the new data, updates attributes/content, removes extra elements,
 * and appends new elements as needed.
 * 
 * @param {HTMLElement} container - The DOM element containing the list
 * @param {Array} itemsData - The new array of data items
 * @param {Function} updateElementFn - (element, data, index) => void (Updates an existing or new element)
 * @param {Function} createElementFn - (data, index) => HTMLElement (Creates a new element)
 */
export function diffAndUpdateDOM(container, itemsData, createElementFn, updateElementFn) {
  if (!container) return;

  const existingChildren = Array.from(container.children);
  const dataCount = itemsData.length;
  
  // 1. Update existing elements or add new ones
  for (let i = 0; i < dataCount; i++) {
    const data = itemsData[i];
    let el;
    
    if (i < existingChildren.length) {
      // Reuse existing element
      el = existingChildren[i];
    } else {
      // Create new element
      el = createElementFn(data, i);
      container.appendChild(el);
    }
    
    // Update the element with new data
    updateElementFn(el, data, i);
  }
  
  // 2. Remove excess elements
  if (existingChildren.length > dataCount) {
    for (let i = dataCount; i < existingChildren.length; i++) {
      container.removeChild(existingChildren[i]);
    }
  }
}
