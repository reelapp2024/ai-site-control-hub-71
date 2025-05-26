import { useState, useRef, useEffect } from "react";

export interface EditorState {
  content: string;
  htmlContent: string;
  selection: {
    start: number;
    end: number;
  };
  lastAction: string | null;
}

export function useEditorState(initialContent: string = "") {
  const [state, setState] = useState<EditorState>({
    content: initialContent,
    htmlContent: initialContent,
    selection: {
      start: 0,
      end: 0,
    },
    lastAction: null,
  });

  const editorRef = useRef<HTMLDivElement | null>(null);

  const updateContent = (content: string) => {
    setState((prev) => ({
      ...prev,
      content,
      lastAction: "update-content",
    }));
  };

  const updateHtmlContent = (htmlContent: string) => {
    setState((prev) => ({
      ...prev,
      htmlContent,
      content: htmlContent.replace(/<[^>]*>/g, ''),
      lastAction: "update-html",
    }));
  };

  const updateSelection = (start: number, end: number) => {
    setState((prev) => ({
      ...prev,
      selection: { start, end },
      lastAction: "update-selection",
    }));
  };

  const applyFormat = (format: string, value?: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    
    try {
      let success = false;

      switch (format) {
        case "bold":
          success = document.execCommand("bold", false);
          break;
        case "italic":
          success = document.execCommand("italic", false);
          break;
        case "underline":
          success = document.execCommand("underline", false);
          break;
        case "strikethrough":
          success = document.execCommand("strikeThrough", false);
          break;
        case "h1":
          success = document.execCommand("formatBlock", false, "H1");
          break;
        case "h2":
          success = document.execCommand("formatBlock", false, "H2");
          break;
        case "h3":
          success = document.execCommand("formatBlock", false, "H3");
          break;
        case "h4":
          success = document.execCommand("formatBlock", false, "H4");
          break;
        case "h5":
          success = document.execCommand("formatBlock", false, "H5");
          break;
        case "h6":
          success = document.execCommand("formatBlock", false, "H6");
          break;
        case "align-left":
          success = document.execCommand("justifyLeft", false);
          break;
        case "align-center":
          success = document.execCommand("justifyCenter", false);
          break;
        case "align-right":
          success = document.execCommand("justifyRight", false);
          break;
        case "ordered-list":
          success = document.execCommand("insertOrderedList", false);
          break;
        case "unordered-list":
          success = document.execCommand("insertUnorderedList", false);
          break;
        case "blockquote":
          success = document.execCommand("formatBlock", false, "blockquote");
          break;
        case "color":
          if (value) {
            success = document.execCommand("foreColor", false, value);
          }
          break;
        case "background":
          if (value) {
            success = document.execCommand("hiliteColor", false, value);
          }
          break;
        case "code":
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const codeElement = document.createElement("code");
            codeElement.style.backgroundColor = "#f4f4f4";
            codeElement.style.padding = "2px 4px";
            codeElement.style.borderRadius = "3px";
            codeElement.style.fontFamily = "monospace";
            
            if (range.toString()) {
              range.surroundContents(codeElement);
              success = true;
            }
          }
          break;
      }

      if (success && editorRef.current) {
        const newHtml = editorRef.current.innerHTML;
        updateHtmlContent(newHtml);
      }
    } catch (error) {
      console.error("Error applying format:", error);
    }
  };

  const insertHTML = (html: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();

    try {
      const success = document.execCommand("insertHTML", false, html);
      
      if (success && editorRef.current) {
        updateHtmlContent(editorRef.current.innerHTML);
      }
    } catch (error) {
      console.error("Error inserting HTML:", error);
    }
  };

  const insertImage = (src: string, alt: string = "", align: string = "center") => {
    const alignClass = align === 'left' ? 'float-left mr-4' : 
                       align === 'right' ? 'float-right ml-4' : 
                       'mx-auto block';
    
    const html = `<figure class="${alignClass} my-4">
      <img src="${src}" alt="${alt}" class="max-w-full h-auto rounded" />
      ${alt ? `<figcaption class="text-center text-sm text-gray-500 mt-2">${alt}</figcaption>` : ''}
    </figure>`;
    
    insertHTML(html);
  };

  const insertVideo = (embedUrl: string) => {
    const html = `<div class="aspect-w-16 aspect-h-9 my-4">
      <iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full rounded"></iframe>
    </div>`;
    
    insertHTML(html);
  };

  const insertTable = (rows: number, cols: number) => {
    let tableHTML = "<table class='border-collapse w-full my-4'>\n<thead>\n<tr>\n";
    
    for (let i = 0; i < cols; i++) {
      tableHTML += `<th class='border border-gray-300 px-4 py-2'>Header ${i+1}</th>\n`;
    }
    tableHTML += "</tr>\n</thead>\n<tbody>\n";
    
    for (let i = 0; i < rows - 1; i++) {
      tableHTML += "<tr>\n";
      for (let j = 0; j < cols; j++) {
        tableHTML += `<td class='border border-gray-300 px-4 py-2'>Cell ${i+1},${j+1}</td>\n`;
      }
      tableHTML += "</tr>\n";
    }
    
    tableHTML += "</tbody>\n</table>";
    
    insertHTML(tableHTML);
  };

  const insertLink = (url: string, text: string, newTab: boolean) => {
    const html = `<a href="${url}" ${newTab ? 'target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
    insertHTML(html);
  };

  const undo = () => {
    try {
      document.execCommand("undo", false);
      if (editorRef.current) {
        updateHtmlContent(editorRef.current.innerHTML);
      }
    } catch (error) {
      console.error("Error with undo:", error);
    }
  };

  const redo = () => {
    try {
      document.execCommand("redo", false);
      if (editorRef.current) {
        updateHtmlContent(editorRef.current.innerHTML);
      }
    } catch (error) {
      console.error("Error with redo:", error);
    }
  };

  return {
    state,
    editorRef,
    updateContent,
    updateHtmlContent,
    updateSelection,
    applyFormat,
    insertHTML,
    insertImage,
    insertVideo,
    insertTable,
    insertLink,
    undo,
    redo,
  };
}
