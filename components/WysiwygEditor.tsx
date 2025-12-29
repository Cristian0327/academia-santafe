'use client';
import { useState, useEffect } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface WysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function WysiwygEditor({ value, onChange, placeholder }: WysiwygEditorProps) {
  const [editorState, setEditorState] = useState(() => {
    if (value) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  useEffect(() => {
    if (value && !editorState.getCurrentContent().hasText()) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, [value]);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const html = draftToHtml(convertToRaw(state.getCurrentContent()));
    onChange(html);
  };

  const editorToolbar = {
    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'history'],
    inline: {
      options: ['bold', 'italic', 'underline', 'strikethrough']
    },
    blockType: {
      inDropdown: true,
      options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
    },
    list: {
      options: ['unordered', 'ordered']
    },
    textAlign: {
      options: ['left', 'center', 'right', 'justify']
    },
    image: {
      uploadEnabled: true,
      uploadCallback: (file: File) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({ data: { link: e.target?.result } });
          };
          reader.readAsDataURL(file);
        });
      },
      previewImage: true,
      alt: { present: true, mandatory: false }
    }
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white" style={{ minHeight: '350px' }}>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        toolbar={editorToolbar}
        placeholder={placeholder || "Escribe aquí..."}
        editorClassName="px-4 py-2"
        toolbarClassName="border-b border-gray-200"
        wrapperClassName="min-h-[300px]"
      />
    </div>
  );
}
