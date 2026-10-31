import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import TruncateMarkup from "react-truncate-markup";
import { Card, CardBody } from "reactstrap";
import { LIST_MARKET_PRODUCT_ITEM, GET_PRODUCT_IMAGES } from "../utils/constants"
import http from '../utils/http';
import { Navigate } from 'react-router-dom';
const imageCache = {};

const extractImageIds = (rawImages) => {
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
        "image_id": String(lastImageId)
      };
      const res = await http.post(GET_PRODUCT_IMAGES, payload);
      // console.log("GET_PRODUCT_IMAGES", res);
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

  const imageSrc = pdctImage?.market_image || item?.image || (Array.isArray(item?.product_images) ? item.product_images[item.product_images.length - 1] : null);

  return (
    <img
      src={imageSrc}
      alt={item?.title || item?.product_name || "Product"}
      className="product-image"
    />
  );
});

function BuySellSection({ onLogin, loggedIn }) {
  let navigate = useNavigate()
  const buyContainerRef = useRef(null);
  const sellContainerRef = useRef(null);

  const [buyActiveIndex, setBuyActiveIndex] = useState(0);
  const [sellActiveIndex, setSellActiveIndex] = useState(0);

  const [isBuyHovered, setIsBuyHovered] = useState(false);
  const [isSellHovered, setIsSellHovered] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState("all");


  const [page, setPage] = useState(1);

  const [start, setStart] = useState(0);
  const sizePerPage = 10;

  const [sellProduct, setSellProduct] = useState([]);
  const [totalSellCount, setTotalSellCount] = useState(0);

  const [buyProduct, setBuyProduct] = useState([]);
  const [totalBuyCount, setTotalBuyCount] = useState(0);

  const fetchProducts = useCallback(async (startValue = start, type) => {
    try {
      const payload = {
        "start": startValue,
        "numberofRows": sizePerPage,
        "filter": [
          {
            "columnName": "type",
            "value": type
          }
        ],
        "sort": []
      }
      // console.log(sizePerPage)
      const res = await http.post(LIST_MARKET_PRODUCT_ITEM, payload);
      // console.log("Fetched Peoples data:", res.data.result);
      if (type == "sell") {
        setSellProduct(res.data.result);
        setTotalSellCount(res.data.totalCount);
      } else {
        setBuyProduct(res.data.result);
        setTotalBuyCount(res.data.totalCount);
      }

    } catch (err) {
      console.error("Failed to fetch Peoples data", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts(start, "sell");
    fetchProducts(start, "buy");
  }, []);

  const toggleDescription = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  const filterItems = (items) => {
    return (items || []).filter((item) => {
      const titleStr = item.product_name || item.title || "";
      const descStr = item.product_desc || item.description || "";
      const catStr = item.category_name || item.name || "";
      const matchesSearch = `${titleStr} ${descStr} ${catStr}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const itemType = (item.type || item.flag || "").toLowerCase();
      const matchesFilter =
        filterType === "all" || itemType === filterType.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  };

  const filteredBuyItems = filterItems(buyProduct);
  const filteredSellItems = filterItems(sellProduct);
  const maskContact = (number) => {
    if (!number) return "";
    const str = number.toString();

    return str.slice(0, -5) + "*****";
  };

  const scrollToIndex = (ref, index) => {
    if (!ref.current) return;

    const cards = ref.current.querySelectorAll(".marketCard");

    const card = cards[index];

    if (!card) return;

    ref.current.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });

  };
  const handleScroll = (ref, setActiveIndex) => {
    if (!ref.current) return;

    const cards = [...ref.current.children];

    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - ref.current.scrollLeft);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  // 1. BUY CAROUSEL -> MOVES TO THE LEFT (0 -> 1 -> 2 -> 3...)
  useEffect(() => {
    if (isBuyHovered) return;

    const interval = setInterval(() => {
      setBuyActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % buyProduct.length;
        scrollToIndex(buyContainerRef, nextIndex);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isBuyHovered, buyProduct.length]);

  // 2. SELL CAROUSEL -> MOVES TO THE RIGHT (Starts from end or decrements index)
  useEffect(() => {
    if (isSellHovered) return;

    const interval = setInterval(() => {
      setSellActiveIndex((prevIndex) => {
        // Decrements to scroll backwards/rightwards
        const nextIndex = prevIndex - 1 < 0 ? sellProduct.length - 1 : prevIndex - 1;
        scrollToIndex(sellContainerRef, nextIndex);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSellHovered, sellProduct.length]);

  const renderCard = (item) => (
    // console.log("item", item),
    <Card className="marketCard" key={item.id}>

      <span
        className={`flag ${item.type === "buy" ? "buyFlag" : "sellFlag"
          }`}
      >
        {item.type}
      </span>

      <CardBody className="cardBody">

        <div
          className={`buysell-badge ${item.type === "buy"
            ? "buy-badge"
            : "sell-badge"
            }`}
        >
          {item.category_name}
        </div>

        <div className="buysell-content">

          {/* Left Side Image */}
          <div
            className="buysell-avatar"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/product/${item.market_id || item.id}`, { state: { product: item } })}
          >

            <div className="image-bg"></div>

            <ShowProductImages item={item} />

          </div>


          {/* Right Side Content */}
          <div className="buysell-description">

            <h4
              className="product-heading"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/product/${item.market_id || item.id}`, { state: { product: item } })}
            >
              {item.product_name}
            </h4>

            {expandedCards[item.id] ? (
              <>
                <p className="product-desc">
                  {item.product_desc}
                </p>

                <span
                  className="show-more-link"
                  onClick={() => toggleDescription(item.id)}
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
                      onClick={() => toggleDescription(item.id)}
                    >
                      Show More
                    </span>
                  </span>
                }
              >
                <p className="product-desc">
                  {item.product_desc}
                </p>
              </TruncateMarkup>
            )}

            <p className="buysell-name">

              -{item.product_name}
            </p>

            <p
              className="buysell-contact clickable-contact"
              onClick={() => {
                if (!loggedIn) {
                  onLogin();
                }
              }}
            >
              <i className="fa fa-phone"></i>

              {loggedIn
                ? item.contact
                : maskContact(item.contact)}
            </p>

          </div>

        </div>

      </CardBody>

    </Card>
  );
  return (
    <section className="buySellSection">
      <div className="container">
        <h2 className="sectionTitle">🛒 Marketplace</h2>
        <div className="filter-menu">
          <button
            className={filterType === "all" ? "active-filter" : ""}
            onClick={() => setFilterType("all")}
          >
            All
          </button>

          <button
            className={filterType === "buy" ? "active-filter" : ""}
            onClick={() => setFilterType("buy")}
          >
            Buy
          </button>

          <button
            className={filterType === "sell" ? "active-filter" : ""}
            onClick={() => setFilterType("sell")}
          >
            Sell
          </button>
        </div>
        <div className="market-search-row">
          <input
            className="market-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product, seller or description..."
          />

          <div className="filter-btn-wrapper">
            <button
              className={`filter-btn ${showFilter ? "filter-btn-active" : ""}`}
              onClick={() => setShowFilter(!showFilter)}
              title="Filter"
            >
              <i className="fa fa-sliders-h"></i>
            </button>

            {showFilter && (
              <>
                <div
                  className="filter-popover-backdrop"
                  onClick={() => setShowFilter(false)}
                />
                <div className="filter-popover">
                  <div className="filter-popover-header">
                    <span>Filters</span>
                    <button
                      className="filter-popover-close"
                      onClick={() => setShowFilter(false)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="filter-popover-body">
                    {/* Category Filter */}
                    <div className="filter-popover-group">
                      <label className="filter-popover-label">Category</label>
                      <div className="filter-chip-row">
                        {["all", "buy", "sell"].map((type) => (
                          <button
                            key={type}
                            className={`filter-chip ${filterType === type ? "filter-chip-active" : ""}`}
                            onClick={() => setFilterType(type)}
                          >
                            {type === "all" ? "🛍 All" : type === "buy" ? "🛒 Buy" : "💰 Sell"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add more filter groups here in the future */}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>


        {/* buy SECTION (Moves Left) */}
        {(filterType === "all" || filterType === "buy") && (
          <div className="cardSection">
            <div
              className="carouselWrapper"
              onMouseEnter={() => setIsBuyHovered(true)}
              onMouseLeave={() => setIsBuyHovered(false)}
            >
              <div
                className="carouselContainer"
                ref={buyContainerRef}
                onScroll={() => handleScroll(buyContainerRef, setBuyActiveIndex)}
              >
                {filteredBuyItems.map(renderCard)}
              </div>

              <div className="dotsContainer">
                {filteredBuyItems.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${buyActiveIndex === index ? 'activeDot' : ''}`}
                    onClick={() => {
                      setBuyActiveIndex(index);
                      scrollToIndex(buyContainerRef, index);
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>)}

        {/* sell SECTION (Moves Right) */}
        {(filterType === "all" || filterType === "sell") && (
          <div className="cardSection">
            <div
              className="carouselWrapper"
              onMouseEnter={() => setIsSellHovered(true)}
              onMouseLeave={() => setIsSellHovered(false)}
            >
              <div
                className="carouselContainer"
                ref={sellContainerRef}
                onScroll={() => handleScroll(sellContainerRef, setSellActiveIndex)}
              >
                {filteredSellItems.map(renderCard)}
              </div>

              <div className="dotsContainer">
                {filteredSellItems.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${sellActiveIndex === index ? 'activeDot' : ''}`}
                    onClick={() => {
                      setSellActiveIndex(index);
                      scrollToIndex(sellContainerRef, index);
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>)}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            className="btn-show-more-marketplace"
            onClick={() => navigate("/marketplace")}
            style={{
              padding: "12px 30px",
              borderRadius: "25px",
              background: "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)",
              color: "#fff",
              border: "none",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(49, 130, 206, 0.3)",
              transition: "all 0.2s ease"
            }}
          >
            Show More Marketplace Items →
          </button>
        </div>
      </div>
    </section>
  );
}

export default BuySellSection;