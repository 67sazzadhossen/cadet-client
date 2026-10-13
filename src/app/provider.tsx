"use client";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{ duration: 4000 }}
        />
      </PersistGate>
    </Provider>
  );
}
