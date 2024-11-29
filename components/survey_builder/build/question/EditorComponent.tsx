"use client";

/**
 * 11/29/2024 - khemu
 * there was an error due to duplicated modules
 * the error was fixed by removing the following node_modules and package-lock.json
 */

import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5/ckeditor5.css";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  Undo,
  Alignment,
  Underline,
  Highlight,
  Font,
} from "ckeditor5";
import { useDispatch } from "react-redux";
import { updateCurrentQuestion } from "@/store/slices/survey/questionSlice";

export interface EditorComponentProps {
  id: string;
  value?: string;
}

const EditorComponent: React.FC<EditorComponentProps> = ({
  id,
  value = "<p>This is the initial content of the editor.</p>",
}) => {
  const dispatch = useDispatch();

  const handleEditorChange = (_event: unknown, editor: ClassicEditor) => {
    const content = editor.getData();
    if (id.toLowerCase().includes("description-")) {
      dispatch(updateCurrentQuestion({ description: content }));
    }
    if (id.toLowerCase().includes("label-")) {
      dispatch(updateCurrentQuestion({ label: content }));
    }
  };

  return (
    <div className="flex flex-col gap-5 mt-3 overflow-visible">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onReady={(editor) => {
          editor.setData(value);
        }}
        onChange={handleEditorChange}
        config={{
          toolbar: {
            items: [
              "fontFamily",
              "fontSize",
              "bold",
              "italic",
              "underline",
              "alignment",
              "highlight",
              "undo",
              "redo",
            ],
          },
          plugins: [
            Font,
            Essentials,
            Bold,
            Italic,
            Alignment,
            Paragraph,
            Underline,
            Highlight,
            Undo,
          ],
          fontSize: {
            options: [
              8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36,
            ],
          },
          fontFamily: {
            options: [
              "default",
              "Arial, Helvetica, sans-serif",
              "Courier New, Courier, monospace",
              "Georgia, serif",
              "Times New Roman, Times, serif",
              "Tahoma, Geneva, sans-serif",
              "Verdana, Geneva, sans-serif",
            ],
          },
        }}
      />
    </div>
  );
};

export default EditorComponent;
