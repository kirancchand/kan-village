import { useState, useEffect, useCallback } from "react";
import http from "../utils/http";
import { GET_MY_HOMEADVERTISEMENT } from "../utils/constants";

export default function AdvertisementLogin() {
  const [active, setActive] = useState(0);
  const [ads, setAds] = useState([]);

  const fetchAds = useCallback(async () => {
    try {
      const res = await http.post(GET_MY_HOMEADVERTISEMENT);

      console.log("Fetched Advertisement data:", res.data);

      setAds(res.data || []);
      setActive(0);
    } catch (err) {
      console.error("Failed to fetch Advertisement data", err);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // Auto carousel
  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [ads.length]);

  const previousSlide = () => {
    if (!ads.length) return;

    setActive((prev) =>
      prev === 0 ? ads.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    if (!ads.length) return;

    setActive((prev) =>
      (prev + 1) % ads.length
    );
  };

  if (!ads.length) {
    return null;
  }

  const currentAd = ads[active] || ads[0];

  return (
    <section className="login-ad-section">

      {/* 1. Image Carousel Container with Title overlay */}
      <div className="login-ad-container">

        <div
          className="login-ad-track"
          style={{
            transform: `translateX(-${active * 100}%)`,
          }}
        >
          {ads.map((ad, index) => (
            <div
              className="login-ad-slide"
              key={ad.id || index}
            >
              <img
                src={ad.advertisement_image}
                alt={
                  ad.advertisement_name ||
                  "Advertisement"
                }
                className="login-ad-image"
              />

              <div className="login-ad-gradient" />

              <div className="login-ad-content">
                {ad.tag && (
                  <span className="login-ad-tag">
                    {ad.tag}
                  </span>
                )}

                <h2>
                  {ad.advertisement_name}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Previous */}
        {ads.length > 1 && (
          <button
            className="login-ad-arrow login-ad-prev"
            onClick={previousSlide}
            aria-label="Previous advertisement"
          >
            ‹
          </button>
        )}

        {/* Next */}
        {ads.length > 1 && (
          <button
            className="login-ad-arrow login-ad-next"
            onClick={nextSlide}
            aria-label="Next advertisement"
          >
            ›
          </button>
        )}

        {/* Indicators */}
        {ads.length > 1 && (
          <div className="login-ad-dots">
            {ads.map((_, index) => (
              <button
                key={index}
                className={
                  active === index
                    ? "login-ad-dot active"
                    : "login-ad-dot"
                }
                onClick={() => setActive(index)}
                aria-label={`Advertisement ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>

      {/* 2. Separate Description Card Below */}
      {currentAd.advertisement_desc && (
        <div className="login-ad-desc-card" key={`desc-${active}`}>
          <div className="login-ad-desc-content">
            <p className="login-ad-desc-text">
              {currentAd.advertisement_desc}
            </p>
          </div>
        </div>
      )}

    </section>
  );
}