
import { useState } from "react";

export interface EditorState {
  content: string;
  htmlContent: string;
  selection: {
    start: number;
    end: number;
  };
}

export function useEditorState(initialContent: string = "") {
  const [state, setState] = useState<EditorState>({
    content: initialContent,
    htmlContent: initialContent,
    selection: {
      start: 0,
      end: 0,
    },
  });

  const updateContent = (content: string) => {
    setState((prev) => ({
      ...prev,
      content,
    }));
  };

  const updateHtmlContent = (htmlContent: string) => {
    setState((prev) => ({
      ...prev,
      htmlContent,
    }));
  };

  const updateSelection = (start: number, end: number) => {
    setState((prev) => ({
      ...prev,
      selection: { start, end },
    }));
  };

  return {
    state,
    updateContent,
    updateHtmlContent,
    updateSelection,
  };
}
