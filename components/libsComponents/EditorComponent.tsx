import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import React, { useEffect } from "react";

export type EditorInstance = {
  setContent: (content: string) => void;
  getContent: () => string;
};

export interface EditorComponentProps {
  editorRef: React.MutableRefObject<EditorInstance | null>;
  id: string;
  title: string;
  initialValue?: string;
  editContent?: string;
}

const EditorComponent: React.FC<EditorComponentProps> = ({
  editorRef,
  id,
  title,
  initialValue = `<p>This is the initial content of the editor.</p>`,
}) => {
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setContent(initialValue); // Set initial content if editor is initialized
    }
  }, [initialValue, editorRef]);

  return (
    <div className="flex flex-col gap-5">
      <label htmlFor={id} className="font-semibold text-xl">
        {title}
      </label>
      <TinyMCEEditor
        
        id={id}
        apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
        onInit={(_, editor) => {
          editorRef.current = editor as EditorInstance;

          // Apply inline styles to certain elements on content set
          editor.on("SetContent", () => {
            // Style headers
            editor
              .getBody()
              .querySelectorAll("h1")
              .forEach((el) => {
                (el as HTMLElement).style.fontSize = "2em";
                (el as HTMLElement).style.fontWeight = "bold";
                (el as HTMLElement).style.color = "blue"; // Example color
              });
            editor
              .getBody()
              .querySelectorAll("h2")
              .forEach((el) => {
                (el as HTMLElement).style.fontSize = "1.5em";
                (el as HTMLElement).style.fontWeight = "bold";
                (el as HTMLElement).style.color = "darkblue";
              });
            editor
              .getBody()
              .querySelectorAll("h3")
              .forEach((el) => {
                (el as HTMLElement).style.fontSize = "1.2em";
                (el as HTMLElement).style.fontWeight = "bold";
                (el as HTMLElement).style.color = "black";
              });
            // Add more headers as needed...

            // Style paragraphs
            editor
              .getBody()
              .querySelectorAll("p")
              .forEach((el) => {
                (el as HTMLElement).style.fontSize = "1em"; // Regular text size
                (el as HTMLElement).style.lineHeight = "1.5";
                (el as HTMLElement).style.marginBottom = "1em";
              });

            // Style lists
            editor
              .getBody()
              .querySelectorAll("ul, ol")
              .forEach((el) => {
                (el as HTMLElement).style.marginLeft = "20px";
              });

            // Style blockquotes
            editor
              .getBody()
              .querySelectorAll("blockquote")
              .forEach((el) => {
                (el as HTMLElement).style.fontStyle = "italic";
                (el as HTMLElement).style.borderLeft = "2px solid gray";
                (el as HTMLElement).style.paddingLeft = "10px";
                (el as HTMLElement).style.margin = "1em 0";
              });
          });
        }}
        initialValue={initialValue}
        init={{
          height: 500,
          menubar: false,
          skin: "oxide-dark",
          content_css: "dark",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
        }}
      />
    </div>
  );
};

export default EditorComponent;
