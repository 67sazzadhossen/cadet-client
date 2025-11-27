// utils/useCloudinaryDestroy.ts
"use client";

import { useState } from "react";

export const useCloudinaryDestroy = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destroyImage = async (publicId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("public_id", publicId);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.result === "ok") {
        console.log("✅ Image destroyed successfully");
        return true;
      } else {
        throw new Error(result.error?.message || "Destroy failed");
      }
    } catch (err: any) {
      const errorMessage =
        err instanceof Error ? err.message : "Destroy failed";
      setError(errorMessage);
      console.error("❌ Destroy error:", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { destroyImage, loading, error };
};
