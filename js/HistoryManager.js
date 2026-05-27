/**
 * PLANO — Shared History Manager (Undo / Redo)
 *
 * Generic memento-pattern state manager.
 * Each app provides its own serialize/clone logic before calling save(),
 * and restores from the opaque snapshot returned by undo()/redo().
 */

export class HistoryManager {
  constructor(maxSteps = 30) {
    this.maxSteps = maxSteps;
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Save a pre-cloned snapshot of the current state.
   * Clears the redo stack (new branch).
   */
  save(snapshot) {
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxSteps) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  /**
   * Pop the current state and return the previous one, or null if nothing to undo.
   */
  undo() {
    if (this.undoStack.length <= 1) return null;
    const current = this.undoStack.pop();
    this.redoStack.push(current);
    return this.undoStack[this.undoStack.length - 1];
  }

  /**
   * Re-apply the last undone state, or return null if nothing to redo.
   */
  redo() {
    if (this.redoStack.length === 0) return null;
    const state = this.redoStack.pop();
    this.undoStack.push(state);
    return state;
  }

  canUndo() { return this.undoStack.length > 1; }
  canRedo() { return this.redoStack.length > 0; }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}
