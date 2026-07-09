import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import type { Awareness } from "y-protocols/awareness.js";

import { CursorThemeManager } from "../utils/CursorThemeManager";

export function CollaborativeEditor({
  roomId,
  doc,
  awareness,
}: {
  roomId: string;
  doc: Y.Doc;
  awareness: Awareness;
}) {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    // Both doc and editor must be ready before creating the binding.
    // Using state (not ref) for editor so this effect re-runs after onMount fires.
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    console.log("Creating Monaco binding");

    const yText = doc.getText("editor");

    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editor]),
      awareness,
    );

    return () => {
      binding.destroy();
    };
  }, [doc, editor, awareness]);

  useEffect(() => {
    const themeManager = new CursorThemeManager(awareness);
    return () => {
      themeManager.destroy();
    };
  }, [awareness]);

  return (
    <Editor
      height="100vh"
      defaultLanguage="javascript"
      defaultValue="// Start coding..."
      onMount={(mountedEditor) => {
        // Storing in state triggers a re-render, which re-runs the
        // MonacoBinding effect with a real editor instance.
        setEditor(mountedEditor);
      }}
    />
  );
}
