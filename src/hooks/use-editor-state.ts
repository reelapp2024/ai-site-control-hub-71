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

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Ensure the editor has focus
    editorRef.current.focus();

    let command = "";
    let commandValue = undefined;

    // Map our format names to execCommand names
    switch (format) {
      case "bold":
        command = "bold";
        break;
      case "italic":
        command = "italic";
        break;
      case "underline":
        command = "underline";
        break;
      case "strikethrough":
        command = "strikeThrough";
        break;
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        command = "formatBlock";
        commandValue = format.toUpperCase();
        break;
      case "align-left":
        command = "justifyLeft";
        break;
      case "align-center":
        command = "justifyCenter";
        break;
      case "align-right":
        command = "justifyRight";
        break;
      case "ordered-list":
        command = "insertOrderedList";
        break;
      case "unordered-list":
        command = "insertUnorderedList";
        break;
      case "color":
        command = "foreColor";
        commandValue = value;
        break;
      case "background":
        command = "hiliteColor";
        commandValue = value;
        break;
      case "link":
        command = "createLink";
        commandValue = value;
        break;
      case "indent":
        command = "indent";
        break;
      case "outdent":
        command = "outdent";
        break;
      case "code":
        // Create a <code> element around the selection
        try {
          const range = selection.getRangeAt(0);
          const codeElement = document.createElement("code");
          codeElement.className = "bg-gray-100 px-1 py-0.5 rounded text-sm font-mono";
          
          if (range.toString()) {
            range.surroundContents(codeElement);
          } else {
            codeElement.textContent = "code";
            range.insertNode(codeElement);
            // Place cursor after the code element
            range.setStartAfter(codeElement);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          
          // Update the HTML content after the change
          updateHtmlContent(editorRef.current.innerHTML);
        } catch (error) {
          console.error("Error applying code format:", error);
        }
        return;
      case "blockquote":
        command = "formatBlock";
        commandValue = "blockquote";
        break;
      default:
        return;
    }

    try {
      // Execute the command
      document.execCommand(command, false, commandValue);
      
      // Update the HTML content after the change
      if (editorRef.current) {
        updateHtmlContent(editorRef.current.innerHTML);
      }
    } catch (error) {
      console.error("Error applying format:", error);
    }
  };

  const insertHTML = (html: string) => {
    if (!editorRef.current) return;

    // Ensure the editor has focus
    editorRef.current.focus();

    try {
      // Try modern approach first
      if (document.queryCommandSupported && document.queryCommandSupported("insertHTML")) {
        document.execCommand("insertHTML", false, html);
      } else {
        // Fallback for browsers that don't support insertHTML
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          
          const div = document.createElement('div');
          div.innerHTML = html;
          
          while (div.firstChild) {
            range.insertNode(div.firstChild);
          }
          
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      
      // Update the HTML content after the change
      updateHtmlContent(editorRef.current.innerHTML);
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
    
    // Header row
    for (let i = 0; i < cols; i++) {
      tableHTML += `<th class='border border-gray-300 px-4 py-2'>Header ${i+1}</th>\n`;
    }
    tableHTML += "</tr>\n</thead>\n<tbody>\n";
    
    // Data rows
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
