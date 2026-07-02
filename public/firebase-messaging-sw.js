importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCKBO1qOPL9wKvN3iPbCVVDzEbVAEMJV_k",
  projectId: "gscam-29846",
  messagingSenderId: "740534750751",
  appId: "1:740534750751:web:96770d827c51f144e18f2a",
});

const messaging = firebase.messaging();
// ব্যাকগ্রাউন্ড নোটিফিকেশন হ্যান্ডেল করার জন্য
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received: ", payload);
});
