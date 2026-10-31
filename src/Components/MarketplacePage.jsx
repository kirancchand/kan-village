import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import TruncateMarkup from "react-truncate-markup";
import { LIST_MARKET_PRODUCT_ITEM } from "../utils/constants";
import http from "../utils/http";
import ShowProductImages from "./ShowProductImages";
import UserContext from "../UserContext";
import Footer from "./Footer";

function MarketplacePage({ onLogin, loggedIn }) {
  const navigate = useNavigate();
  const { appName } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Filter & Search state
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const startOffset = (currentPage - 1) * pageSize;
      const filterArray = [];

      if (filterType !== "all") {
        filterArray.push({
          columnName: "type",
          value: filterType,
        });
      }

      const payload = {
        start: startOffset,
        numberofRows: pageSize,
        filter: filterArray,
        sort: [],
      };

      const res = await http.post(LIST_MARKET_PRODUCT_ITEM, payload);
      setProducts(res.data?.result || []);
      setTotalCount(res.data?.totalCount || 0);
    } catch (err) {
      console.error("Failed to fetch marketplace products:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filterType]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const toggleDescription = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const maskContact = (number) => {
    if (!number) return "";
    const str = number.toString();
    return str.slice(0, -5) + "*****";
  };

  const filteredProducts = products.filter((item) => {
    if (!searchQuery.trim()) return true;
    const titleStr = item.product_name || item.title || "";
    const descStr = item.product_desc || item.description || "";
    const catStr = item.category_name || item.name || "";
    return `${titleStr} ${descStr} ${catStr}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="marketplace-page-wrapper" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* ─────────────────────────────────────────
          HERO BANNER HEADER (MATCHES HOME PAGE)
      ───────────────────────────────────────── */}
      <div className="dash-banner">
        <div className="dash-hello">🛍 {appName || "Village"} Community Marketplace</div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", margin: "10px 0 15px", textShadow: "0 2px 20px rgba(0,0,0,0.15)" }}>
          Local Buy & Sell Directory
        </h1>
        <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem", opacity: 0.9, lineHeight: 1.6 }}>
          Explore products, post requirements, and connect directly with fellow residents across the village.
        </p>
      </div>

      {/* ─────────────────────────────────────────
          MARKETPLACE CATALOG SECTION
      ───────────────────────────────────────── */}
      <div className="container" style={{ padding: "40px 15px 80px" }}>
        {/* Toolbar: Search, Filters & Count Summary */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px 28px",
            boxShadow: "0 10px 30px rgba(15, 118, 110, 0.08)",
            border: "1px solid rgba(15, 118, 110, 0.1)",
            marginBottom: "35px",
          }}
        >
          <div
            style={{
              display: "flex",
              justify: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {/* Filter Menu Pills */}
            <div className="filter-menu" style={{ margin: 0, gap: "10px" }}>
              <button
                className={filterType === "all" ? "active-filter" : ""}
                onClick={() => {
                  setFilterType("all");
                  setCurrentPage(1);
                }}
                style={{ borderRadius: "25px", padding: "10px 24px", fontWeight: "600" }}
              >
                🛍 All ({totalCount})
              </button>
              <button
                className={filterType === "buy" ? "active-filter" : ""}
                onClick={() => {
                  setFilterType("buy");
                  setCurrentPage(1);
                }}
                style={{ borderRadius: "25px", padding: "10px 24px", fontWeight: "600" }}
              >
                🛒 Buy Requests
              </button>
              <button
                className={filterType === "sell" ? "active-filter" : ""}
                onClick={() => {
                  setFilterType("sell");
                  setCurrentPage(1);
                }}
                style={{ borderRadius: "25px", padding: "10px 24px", fontWeight: "600" }}
              >
                💰 Sell Offers
              </button>
            </div>

            {/* Search Field */}
            <div style={{ position: "relative", flex: "1 1 320px", maxWidth: "480px" }}>
              <i
                className="fa fa-search"
                style={{
                  position: "absolute",
                  left: "18px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#0f766e",
                  fontSize: "16px",
                }}
              ></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, description or category..."
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 46px",
                  borderRadius: "50px",
                  border: "1.5px solid #e2e8f0",
                  outline: "none",
                  fontSize: "0.95rem",
                  transition: "all 0.25s ease",
                  background: "#f8fafc",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#14b8a6";
                  e.target.style.background = "#fff";
                  e.target.style.boxShadow = "0 0 0 4px rgba(20, 184, 166, 0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", padding: "0 5px" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f2027", margin: 0 }}>
            {filterType === "all" ? "All Marketplace Listings" : filterType === "buy" ? "🛒 Buy Requirements" : "💰 Items for Sale"}
          </h3>
          {totalCount > 0 && (
            <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
              Showing <strong>{startIndex}</strong>–<strong>{endIndex}</strong> of <strong>{totalCount}</strong> items
            </span>
          )}
        </div>

        {/* Loading / Empty State */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#0f766e" }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: "36px", marginBottom: "15px", display: "block" }}></i>
            <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "70px 20px",
              background: "#fff",
              borderRadius: "20px",
              border: "1px dashed #cbd5e1",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>🛍</div>
            <h4 style={{ color: "#1e293b", fontWeight: "700", marginBottom: "8px" }}>No items found</h4>
            <p style={{ color: "#64748b", maxWidth: "400px", margin: "0 auto 20px" }}>
              We couldn't find any marketplace items matching your filter or search criteria.
            </p>
            {searchQuery && (
              <button
                className="btn btn-outline-primary"
                onClick={() => setSearchQuery("")}
                style={{ borderRadius: "50px", padding: "8px 24px" }}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* Responsive Product Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: "25px",
              marginBottom: "45px",
            }}
          >
            {filteredProducts.map((item) => (
              <Card
                className="marketCard"
                key={item.market_id || item.id}
                style={{
                  margin: 0,
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 25px rgba(15, 118, 110, 0.08)",
                  border: "1px solid rgba(15, 118, 110, 0.12)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  background: "#fff",
                }}
              >
                <span className={`flag ${item.type === "buy" ? "buyFlag" : "sellFlag"}`}>
                  {item.type}
                </span>

                <CardBody className="cardBody">
                  <div className={`buysell-badge ${item.type === "buy" ? "buy-badge" : "sell-badge"}`}>
                    {item.category_name}
                  </div>

                  <div className="buysell-content">
                    {/* Product Image */}
                    <div
                      className="buysell-avatar"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/product/${item.market_id || item.id}`, { state: { product: item } })}
                    >
                      <div className="image-bg"></div>
                      <ShowProductImages item={item} />
                    </div>

                    {/* Content Details */}
                    <div className="buysell-description">
                      <h4
                        className="product-heading"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/product/${item.market_id || item.id}`, { state: { product: item } })}
                      >
                        {item.product_name}
                      </h4>

                      {expandedCards[item.market_id || item.id] ? (
                        <>
                          <p className="product-desc">{item.product_desc}</p>
                          <span
                            className="show-more-link"
                            onClick={() => toggleDescription(item.market_id || item.id)}
                          >
                            Show Less
                          </span>
                        </>
                      ) : (
                        <TruncateMarkup
                          lines={2}
                          ellipsis={
                            <span>
                              ...
                              <span
                                className="show-more-link"
                                onClick={() => toggleDescription(item.market_id || item.id)}
                              >
                                Show More
                              </span>
                            </span>
                          }
                        >
                          <p className="product-desc">{item.product_desc}</p>
                        </TruncateMarkup>
                      )}

                      <p className="buysell-name">-{item.product_name}</p>

                      <p
                        className="buysell-contact clickable-contact"
                        onClick={() => {
                          if (!loggedIn && onLogin) {
                            onLogin();
                          }
                        }}
                      >
                        <i className="fa fa-phone"></i>
                        {loggedIn ? item.contact : maskContact(item.contact)}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* ─────────────────────────────────────────
            PAGINATION CONTROLS
        ───────────────────────────────────────── */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justify: "center",
              alignItems: "center",
              gap: "12px",
              padding: "25px 0",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn btn-outline-success"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              style={{
                borderRadius: "50px",
                padding: "9px 24px",
                fontWeight: "600",
                borderColor: "#0f766e",
                color: currentPage === 1 ? "#94a3b8" : "#0f766e",
              }}
            >
              ← Previous
            </button>

            <div style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    borderRadius: "50%",
                    width: "42px",
                    height: "42px",
                    fontWeight: "700",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    background: currentPage === pageNum ? "linear-gradient(135deg, #0f766e, #0284c7)" : "#e2e8f0",
                    color: currentPage === pageNum ? "#fff" : "#475569",
                    boxShadow: currentPage === pageNum ? "0 4px 14px rgba(20, 184, 166, 0.35)" : "none",
                  }}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              className="btn btn-outline-success"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              style={{
                borderRadius: "50px",
                padding: "9px 24px",
                fontWeight: "600",
                borderColor: "#0f766e",
                color: currentPage === totalPages ? "#94a3b8" : "#0f766e",
              }}
            >
              Next →
            </button>

            {/* Items Per Page Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "15px" }}>
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>Per Page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: "12px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "0.88rem",
                  color: "#1e293b",
                  outline: "none",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <option value={8}>8 items</option>
                <option value={12}>12 items</option>
                <option value={24}>24 items</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <Footer loggedIn={loggedIn} />
    </div>
  );
}

export default MarketplacePage;
