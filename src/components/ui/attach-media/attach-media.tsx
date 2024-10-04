import { FaUpload } from "react-icons/fa6";
import { LuImage } from "react-icons/lu";

const AttachMedia = ({
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
    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setSelectedFile(file);
    } else {
      console.error("Invalid file type. Please select a JPG or PNG image.");
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(undefined);
  };
  return (
    <div className="h-full mb-6">
      {/* <div className="bg-gray-200 dark:bg-zinc-600 p-6"> */}
      <div className="min-h-[200px] flex flex-col items-center justify-center w-full border-3 border-dashed rounded-lg bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-zinc-700">
        {!selectedFile ? (
          <label className="h-[200px] w-full flex flex-col items-center justify-center" htmlFor={`file-upload-${fileId}`}>
            <LuImage className="image-bg" size={30} />
            <p className="text-sm text-default-400">Chọn ảnh từ máy tính</p>
          </label>
        ) : (
          <img
            className="w-full h-fit p-2 object-cover cursor-pointer"
            onClick={handleRemoveImage}
            src={typeof selectedFile === "object" ? URL.createObjectURL(selectedFile) : selectedFile}
            alt="image preview"
          />
        )}
        <input id={`file-upload-${fileId}`} type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png" hidden />
      </div>
      {/* </div> */}
    </div>
  );
};

export default AttachMedia;
