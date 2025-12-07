import { useRef, useEffect, useState } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Link, Code, 
  Heading1, Heading2, Heading3, Quote, Minus, Table, 
  AlignLeft, AlignCenter, AlignRight, Undo, Redo
} from 'lucide-react';

const SimpleTextEditor = ({ value, onChange, placeholder = "Enter text..." }) => {
  const editorRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    checkUndoRedo();
  };

  const checkUndoRedo = () => {
    // Check if undo/redo is available (basic check)
    setCanUndo(true);
    setCanRedo(true);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertCodeBlock = () => {
    const code = prompt('Enter code:');
    if (code) {
      const codeBlock = `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      execCommand('insertHTML', codeBlock);
    }
  };

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    if (rows && cols) {
      let table = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          table += `<td style="border: 1px solid #B8B8B8; padding: 8px;">&nbsp;</td>`;
        }
        table += '</tr>';
      }
      table += '</table>';
      execCommand('insertHTML', table);
    }
  };

  const insertHeading = (level) => {
    const text = window.getSelection().toString();
    if (text) {
      execCommand('formatBlock', `h${level}`);
    } else {
      execCommand('formatBlock', `h${level}`);
    }
  };

  const insertQuote = () => {
    execCommand('formatBlock', 'blockquote');
  };

  const insertHorizontalRule = () => {
    execCommand('insertHorizontalRule');
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
      <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-white/5">
        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => execCommand('undo')}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('redo')}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
        <div className="w-px bg-white/10 mx-1" />
        
        {/* Headings */}
        <button
          type="button"
          onClick={() => insertHeading(1)}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertHeading(2)}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertHeading(3)}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-px bg-white/10 mx-1" />
        
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px bg-white/10 mx-1" />
        
        {/* Lists */}
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px bg-white/10 mx-1" />
        
        {/* Alignment */}
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <div className="w-px bg-white/10 mx-1" />
        
        {/* Special Elements */}
        <button
          type="button"
          onClick={insertCodeBlock}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Insert Code Block"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={insertQuote}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={insertTable}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Insert Table"
        >
          <Table className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={insertHorizontalRule}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Horizontal Line"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-px bg-white/10 mx-1" />
        
        {/* Link */}
        <button
          type="button"
          onClick={insertLink}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Insert Link"
        >
          <Link className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-4 focus:outline-none overflow-y-auto prose prose-invert max-w-none"
        style={{
          color: '#FFFFFF',
          backgroundColor: 'transparent'
        }}
        data-placeholder={placeholder}
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #B8B8B8;
          pointer-events: none;
        }
        [contenteditable] pre {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 4px;
          margin: 8px 0;
          overflow-x: auto;
        }
        [contenteditable] pre code {
          color: #4A90E2;
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }
        [contenteditable] table {
          border-collapse: collapse;
          width: 100%;
          margin: 12px 0;
        }
        [contenteditable] table td,
        [contenteditable] table th {
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          text-align: left;
        }
        [contenteditable] table th {
          background: rgba(255, 255, 255, 0.1);
          font-weight: 600;
        }
        [contenteditable] blockquote {
          border-left: 4px solid #4A90E2;
          padding-left: 16px;
          margin: 12px 0;
          color: #B8B8B8;
          font-style: italic;
        }
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 16px 0 8px 0;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 14px 0 6px 0;
        }
        [contenteditable] h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 12px 0 4px 0;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 8px 0;
          padding-left: 24px;
        }
        [contenteditable] li {
          margin: 4px 0;
        }
        [contenteditable] hr {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          margin: 16px 0;
        }
        [contenteditable] a {
          color: #4A90E2;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default SimpleTextEditor;

