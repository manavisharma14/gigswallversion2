import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { readFileSync } from "fs";
import path from "path";

// Load service account from local file ONLY for development
const serviceAccount = JSON.parse(
  readFileSync(path.join(process.cwd(), "firebase-admin-key.json"), "utf-8")
);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const storage = getStorage().bucket();