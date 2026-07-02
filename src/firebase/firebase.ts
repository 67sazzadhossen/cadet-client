import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyCKBO1qOPL9wKvN3iPbCVVDzEbVAEMJV_k",
  authDomain: "gscam-29846.firebaseapp.com",
  projectId: "gscam-29846",
  storageBucket: "gscam-29846.firebasestorage.app",
  messagingSenderId: "740534750751",
  appId: "1:740534750751:web:96770d827c51f144e18f2a",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();

  if (!supported) {
    return null;
  }

  return getMessaging(app);
};
