// lib/uploadChatFile.ts (client → API)
export async function uploadChatFile(
  roomId: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; name: string; size: number }>  {
  const form = new FormData();
  form.append("file", file);
  form.append("roomId", roomId);

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject("Upload failed");
      }
    };

    xhr.onerror = () => reject("Network error");

    xhr.open("POST", "/api/chat/upload");
    xhr.send(form);
  });
}