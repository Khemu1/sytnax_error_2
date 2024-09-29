import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { FileUploaderProps } from "@/types";
import Image from "next/image";
// Register plugins
registerPlugin(FilePondPluginImagePreview);

const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  setFile,
  title,
  initialImage,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {initialImage && (
        <div className="mb-2">
          <h3 className="text-lg font-semibold">Current {title}:</h3>
          <Image
            src={initialImage}
            alt={`${title} preview`}
            className="rounded mx-auto"
            width={500}
            height={500}
          />
        </div>
      )}
      <h2 className="font-semibold text-xl">{initialImage ? "Update":"Upload"} {title}:</h2>
      <FilePond
        
        files={file ? [file] : []}
        allowMultiple={false}
        onupdatefiles={(fileItems) => {
          setFile((fileItems[0]?.file as File) || null);
        }}
        name={`${title.toLowerCase()}Image`}
      />
    </div>
  );
};

export default FileUploader;
