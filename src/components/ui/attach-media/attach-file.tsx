import { FolderUp } from "lucide-react";
import { FaFileExcel } from "react-icons/fa6";

const AttachFile = ({
  fileId,
  selectedFile,
  setSelectedFile,
}: {
  fileId: string;
  selectedFile: File | string | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | string | undefined>>;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : undefined;
    if (file && ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(file.type)) {
      setSelectedFile(file);
    } else {
      console.error("Invalid file type. Please select an Excel (xlsx) file.");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(undefined);
    (document.getElementById(`file-upload-${fileId}`) as HTMLInputElement).value = "";
  };

  return (
    <div className="h-full mb-6">
      <div className="min-h-[200px] flex flex-col items-center justify-center w-full border-3 border-dashed rounded-lg bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-zinc-700">
        {!selectedFile ? (
          <label className="h-[200px] w-full flex flex-col items-center justify-center" htmlFor={`file-upload-${fileId}`}>
            <FolderUp className="text-green-600" size={30} />
            <p className="text-sm text-default-400 mt-2">Chọn tập tin từ máy bạn (.xlsx)</p>
          </label>
        ) : (
          <div 
            className="w-full h-[200px] flex flex-col items-center justify-center cursor-pointer p-2"
            onClick={handleRemoveFile}
          >
            <FaFileExcel className="text-green-600" size={40} />
            <p className="text-sm text-default-400 mt-2">{typeof selectedFile === "object" ? selectedFile.name : selectedFile}</p>
            <p className="text-xs text-default-400">(Click để xóa)</p>
          </div>
        )}
        <input id={`file-upload-${fileId}`} type="file" onChange={handleFileChange} accept=".xlsx" hidden />
      </div>
    </div>
  );
};

export default AttachFile;
