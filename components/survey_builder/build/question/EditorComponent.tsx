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

export interface EditorComponentProps {
  id: string;
  value?: string;
  onChange: (e: string) => void;
}

const EditorComponent: React.FC<EditorComponentProps> = ({
  value = "<p>This is the initial content of the editor.</p>",
  onChange,
}) => {
  const handleEditorChange = (_event: unknown, editor: ClassicEditor) => {
    const content = editor.getData();
    if (!onChange) {
      alert("onChange is not defined");
    }
    onChange(content);
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
          licenseKey: "GPL",
          toolbar: [
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
