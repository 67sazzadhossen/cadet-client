import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCKBO1qOPL9wKvN3iPbCVVDzEbVAEMJV_k",
  authDomain: "gscam-29846.firebaseapp.com",
  projectId: "gscam-29846",
  storageBucket: "gscam-29846.firebasestorage.app",
  messagingSenderId: "740534750751",
  appId: "1:740534750751:web:96770d827c51f144e18f2a",
};

// অ্যাপটি একবারই ইনিশিয়ালাইজ হয়েছে কি না তা চেক করা
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Messaging সার্ভিস এক্সপোর্ট করা
export const messaging = getMessaging(app);
