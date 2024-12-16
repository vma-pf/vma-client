import { Video } from "lucide-react";
import { FaVideo } from "react-icons/fa6";

const AttachVideo = ({
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
    if (file && ["video/mp4", "video/webm", "video/ogg"].includes(file.type)) {
      setSelectedFile(file);
    } else {
      console.error("Invalid file type. Please select a video file (mp4, webm, ogg).");
    }
  };

  const handleRemoveVideo = () => {
    setSelectedFile(undefined);
    (document.getElementById(`file-upload-${fileId}`) as HTMLInputElement).value = "";
  };

  return (
    <div className="h-full mb-6">
      <div className="min-h-[400px] flex flex-col items-center justify-center w-full border-3 border-dashed rounded-lg bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-zinc-700">
        {!selectedFile ? (
          <label className="h-[200px] w-full flex flex-col items-center justify-center" htmlFor={`file-upload-${fileId}`}>
            <Video className="text-green-600" size={30} />
            <p className="text-sm text-default-400 mt-2">Chọn video từ máy bạn (.mp4, .webm, .ogg)</p>
          </label>
        ) : (
          <div 
            className="w-full h-[200px] flex flex-col items-center justify-center cursor-pointer p-2"
            onClick={handleRemoveVideo}
          >
            <FaVideo className="text-green-600" size={40} />
            <p className="text-sm text-default-400 mt-2">{typeof selectedFile === "object" ? selectedFile.name : selectedFile}</p>
            <p className="text-xs text-default-400">(Click để xóa)</p>
            {selectedFile instanceof File && (
              <video 
                className="mt-2 w-[500px] h-[500px]"
                src={URL.createObjectURL(selectedFile)}
                controls
              />
            )}
          </div>
        )}
        <input 
          id={`file-upload-${fileId}`} 
          type="file" 
          onChange={handleFileChange} 
          accept="video/mp4,video/webm,video/ogg" 
          hidden 
        />
      </div>
    </div>
  );
};

export default AttachVideo;