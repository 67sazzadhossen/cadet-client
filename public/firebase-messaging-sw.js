/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCKBO1qOPL9wKvN3iPbCVVDzEbVAEMJV_k",
  authDomain: "gscam-29846.firebaseapp.com",
  projectId: "gscam-29846",
  storageBucket: "gscam-29846.firebasestorage.app",
  messagingSenderId: "740534750751",
  appId: "1:740534750751:web:96770d827c51f144e18f2a",
};

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log("Background message received: ", payload);
    const notificationTitle =
      payload.notification?.title || "New Notification";
    const notificationOptions = {
      body: payload.notification?.body || "",
      icon: payload.notification?.icon || "/logo.png",
      data: payload.data,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (error) {
  console.warn("Firebase messaging service worker initialization error:", error);
}
