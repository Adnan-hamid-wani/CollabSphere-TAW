import { create } from "zustand";
import axios from "axios";

type FileUploadStore = {
  fileUrl: string | null;
  uploading: boolean;
  uploadFile: (file: File) => Promise<void>;
  reset: () => void;
};

export const useFileUploadStore = create<FileUploadStore>((set) => ({
  fileUrl: null,
  uploading: false,
  uploadFile: async (file) => {
    set({ uploading: true });

    try {
      const formData = new FormData();
      formData.append("file", file);

     const response = await axios.post("http://localhost:4000/api/files/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});


      set({ fileUrl: response.data.fileUrl });
    } catch (error) {
      console.error("File upload failed", error);
    } finally {
      set({ uploading: false });
    }
  },
  reset: () => set({ fileUrl: null, uploading: false }),
}));
