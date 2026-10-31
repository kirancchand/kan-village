import React, { useState, useEffect, useCallback, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GET_PRODUCT_IMAGES, LIST_MARKET_PRODUCT_ITEM } from "../utils/constants";
import http from "../utils/http";
import { extractImageIds } from "./ShowProductImages";
import UserContext from "../UserContext";
import Footer from "./Footer";

export default function ProductDetailPage({ onLogin, loggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { appName } = useContext(UserContext);

  const [product, setProduct] = useState(location.state?.product || null);
  const [images, setImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(!location.state?.product);

  // If product wasn't passed in navigation state, fetch it by ID
  useEffect(() => {
    if (!product && id) {
      setLoadingProduct(true);
      http.post(LIST_MARKET_PRODUCT_ITEM, {
        start: 0,
        numberofRows: 100,
        filter: [],
        sort: [],
      })
        .then((res) => {
          const list = res.data?.result || [];
          const found = list.find(
            (p) => String(p.market_id) === String(id) || String(p.id) === String(id)
          );
          if (found) setProduct(found);
        })
        .catch((err) => console.error("Error loading product detail", err))
        .finally(() => setLoadingProduct(false));
    }
  }, [id, product]);

  // Fetch all images for the product
  const fetchAllImages = useCallback(async () => {
    if (!product) return;
    const imageIds = extractImageIds(product.images);

    if (imageIds.length === 0) {
      // Fallback images if any
      const fallback = product.market_image || product.image || [];
      setImages(Array.isArray(fallback) ? fallback : fallback ? [fallback] : []);
      return;
    }

    setLoadingImages(true);
    try {
      const promises = imageIds.map((imgId) =>
        http.post(GET_PRODUCT_IMAGES, { image_id: String(imgId) })
          .then((res) => res.data?.market_image || res.data?.image || null)
          .catch(() => null)
      );
      const results = await Promise.all(promises);
      const validImages = results.filter(Boolean);
      setImages(validImages);
    } catch (err) {
      console.error("Error fetching product images", err);
    } finally {
      setLoadingImages(false);
    }
  }, [product]);

  useEffect(() => {
    fetchAllImages();
  }, [fetchAllImages]);

  const maskContact = (number) => {
    if (!number) return "";
    const str = number.toString();
    return str.slice(0, -5) + "*****";
  };

  if (loadingProduct) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px", color: "#0f766e" }}>
        <i className="fa fa-spinner fa-spin" style={{ fontSize: "36px", marginBottom: "15px", display: "block" }}></i>
        <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Product Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate("/marketplace")}>
          Return to Marketplace
        </button>
      </div>
    );
  }

  const currentImage = images[activeImageIndex] || product.image || "/placeholder.png";

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero Banner Header */}
      <div className="dash-banner">
        <div className="dash-hello">🛍 {appName || "Village"} Marketplace</div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", margin: "10px 0 10px" }}>
          {product.product_name || "Product Details"}
        </h1>
        <p style={{ opacity: 0.9 }}>
          {product.category_name} · {product.type === "buy" ? "Buy Requirement" : "Sell Offer"}
        </p>
      </div>

      <div className="container" style={{ padding: "40px 15px 80px" }}>
        {/* Navigation back bar */}
        <div style={{ marginBottom: "25px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "#fff",
              border: "1.5px solid #cbd5e1",
              borderRadius: "50px",
              padding: "8px 22px",
              fontWeight: "600",
              fontSize: "0.9rem",
              color: "#0f766e",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            ← Back to Catalog
          </button>
        </div>

        {/* Product Detail Card Container */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "35px",
            boxShadow: "0 15px 35px rgba(15, 118, 110, 0.08)",
            border: "1px solid rgba(15, 118, 110, 0.1)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* Left Side: Multi-Image Gallery */}
          <div>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "360px",
                borderRadius: "20px",
                overflow: "hidden",
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                marginBottom: "20px",
              }}
            >
              {loadingImages ? (
                <div style={{ color: "#0f766e" }}>
                  <i className="fa fa-spinner fa-spin" style={{ fontSize: "28px" }}></i>
                </div>
              ) : (
                <img
                  src={currentImage}
                  alt={product.product_name}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              )}

              {/* Prev / Next Image Overlay Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                    }
                    style={{
                      position: "absolute",
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(6px)",
                      border: "none",
                      fontSize: "18px",
                      color: "#0f766e",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                    }
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(6px)",
                      border: "none",
                      fontSize: "18px",
                      color: "#0f766e",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                }}
              >
                {images.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: activeImageIndex === idx ? "2.5px solid #0f766e" : "1.5px solid #e2e8f0",
                      cursor: "pointer",
                      opacity: activeImageIndex === idx ? 1 : 0.6,
                      transition: "all 0.2s ease",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span
                style={{
                  background: product.type === "buy" ? "#e0f2fe" : "#fef3c7",
                  color: product.type === "buy" ? "#0284c7" : "#d97706",
                  padding: "5px 16px",
                  borderRadius: "50px",
                  fontWeight: "700",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {product.type === "buy" ? "🛒 Buy Requirement" : "💰 Sell Offer"}
              </span>

              <span
                style={{
                  background: "rgba(15, 118, 110, 0.1)",
                  color: "#0f766e",
                  padding: "5px 16px",
                  borderRadius: "50px",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                }}
              >
                Category: {product.category_name}
              </span>
            </div>

            <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#0f2027", marginBottom: "15px" }}>
              {product.product_name}
            </h2>

            <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "20px", marginBottom: "20px" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
                Description
              </h4>
              <p style={{ color: "#334155", fontSize: "1.02rem", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {product.product_desc || "No description provided."}
              </p>
            </div>

            {/* Seller Info Box */}
            <div
              style={{
                background: "#f0fdf9",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid rgba(15, 118, 110, 0.18)",
                marginBottom: "25px",
              }}
            >
              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0f766e", marginBottom: "10px" }}>
                Seller Information
              </h4>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    background: "#0f766e",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  <i className="fa fa-user"></i>
                </div>
                <div>
                  <div style={{ fontWeight: "700", color: "#0f2027" }}>
                    {product.product_name || "Village Resident"}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Category: {product.category_name}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Action */}
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  if (!loggedIn && onLogin) {
                    onLogin();
                  } else if (product.contact) {
                    window.location.href = `tel:${product.contact}`;
                  }
                }}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  background: "linear-gradient(135deg, #0f766e, #0284c7)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50px",
                  padding: "14px 28px",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 6px 20px rgba(20, 184, 166, 0.3)",
                }}
              >
                <i className="fa fa-phone"></i>
                {loggedIn ? `Call: ${product.contact}` : `Sign in to View Contact (${maskContact(product.contact)})`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer loggedIn={loggedIn} />
    </div>
  );
}
