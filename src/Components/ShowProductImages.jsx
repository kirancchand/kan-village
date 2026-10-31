import React, { useState, useEffect, useCallback } from "react";
import { GET_PRODUCT_IMAGES } from "../utils/constants";
import http from "../utils/http";

const imageCache = {};

export const extractImageIds = (rawImages) => {
  if (!rawImages) return [];
  if (Array.isArray(rawImages)) return rawImages;

  if (typeof rawImages === "string") {
    let str = rawImages.trim();
    // Handle PostgreSQL array format: {"14","15"} or {14,15}
    if (str.startsWith("{") && str.endsWith("}")) {
      str = str.slice(1, -1).trim();
      if (!str) return [];
      return str.split(",").map((s) => s.replace(/["']/g, "").trim()).filter(Boolean);
    }
    // Handle JSON array format: ["14","15"]
    if (str.startsWith("[") && str.endsWith("]")) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // fallback
      }
    }
    // Handle comma-separated string
    if (str.includes(",")) {
      return str.split(",").map((s) => s.replace(/["'{}]/g, "").trim()).filter(Boolean);
    }
    return [str.replace(/["'{}]/g, "").trim()].filter(Boolean);
  }

  return [rawImages];
};

const ShowProductImages = React.memo(({ item }) => {
  const imageIds = extractImageIds(item?.images);
  const lastImageId = imageIds.length > 0 ? imageIds[imageIds.length - 1] : null;

  const [pdctImage, setPdctImage] = useState(() => {
    return lastImageId && imageCache[lastImageId] ? imageCache[lastImageId] : null;
  });
  const [loader, setLoader] = useState(false);

  const fetchImage = useCallback(async () => {
    if (!lastImageId) return;
    if (imageCache[lastImageId]) {
      setPdctImage(imageCache[lastImageId]);
      return;
    }
    setLoader(true);
    try {
      const payload = {
        image_id: String(lastImageId),
      };
      const res = await http.post(GET_PRODUCT_IMAGES, payload);
      imageCache[lastImageId] = res.data;
      setPdctImage(res.data);
    } catch (err) {
      console.error("Failed to fetch product image", err);
    } finally {
      setLoader(false);
    }
  }, [lastImageId]);

  useEffect(() => {
    if (lastImageId && !imageCache[lastImageId]) {
      fetchImage();
    }
  }, [fetchImage, lastImageId]);

  if (loader) return "Loading...";

  const imageSrc =
    pdctImage?.market_image ||
    item?.image ||
    (Array.isArray(item?.product_images)
      ? item.product_images[item.product_images.length - 1]
      : null);

  return (
    <img
      src={imageSrc}
      alt={item?.title || item?.product_name || "Product"}
      className="product-image"
    />
  );
});

export default ShowProductImages;
