// app/providers.tsx (নতুন file তৈরি করুন)
"use client";

import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
