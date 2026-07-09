import { Awareness } from "y-protocols/awareness";

/**
 * Manages the dynamic injection of y-monaco CSS cursor rules.
 *
 * y-monaco assigns CSS classes like yRemoteSelection-12345 to cursors,
 * but does not inject the actual <style> definitions.
 *
 * This manager listens to awareness updates and injects CSS rules *only once*
 * per new user, using CSSStyleSheet.insertRule for maximum performance.
 */
export class CursorThemeManager {
  private styleEl: HTMLStyleElement | null = null;
  private styledClients = new Set<number>();
  private awareness: Awareness;

  constructor(awareness: Awareness) {
    this.awareness = awareness;
    this.handleAwarenessChange = this.handleAwarenessChange.bind(this);

    if (typeof document !== "undefined") {
      this.styleEl = document.createElement("style");
      this.styleEl.id = "y-monaco-dynamic-styles";
      document.head.appendChild(this.styleEl);

      this.awareness.on("change", this.handleAwarenessChange);
      // Initialize any clients that already exist
      this.handleAwarenessChange();
    }
  }

  private handleAwarenessChange() {
    if (!this.styleEl || !this.styleEl.sheet) return;

    const sheet = this.styleEl.sheet as CSSStyleSheet;

    this.awareness.getStates().forEach((state, clientId) => {
      // If we've already generated CSS rules for this client, do nothing.
      // This makes mouse movements O(1) efficiency.
      if (this.styledClients.has(clientId)) return;

      if (state.user && state.user.color) {
        this.styledClients.add(clientId);

        const color = state.user.color;
        const name = state.user.name || "Anonymous";

        const rules = [
          `.yRemoteSelection-${clientId} { background-color: ${color}33 !important; }`,
          `.yRemoteSelectionHead-${clientId} { border-left: 2px solid ${color} !important; }`,
          `.yRemoteSelectionHead-${clientId}::after {
            position: absolute;
            content: '${name}';
            background-color: ${color};
            color: #fff;
            font-size: 11px;
            font-family: var(--font-sans), sans-serif;
            font-weight: 600;
            left: -2px;
            top: -18px;
            padding: 1px 6px;
            border-radius: 4px 4px 4px 0;
            white-space: nowrap;
            pointer-events: none;
            z-index: 10;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          }`,
        ];

        rules.forEach((rule) => {
          try {
            sheet.insertRule(rule, sheet.cssRules.length);
          } catch (e) {
            console.error("Failed to insert rule:", rule, e);
          }
        });
      }
    });
  }

  public destroy() {
    if (this.styleEl) {
      this.awareness.off("change", this.handleAwarenessChange);
      this.styleEl.remove();
      this.styleEl = null;
    }
    this.styledClients.clear();
  }
}
