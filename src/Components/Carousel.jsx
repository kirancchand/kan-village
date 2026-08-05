import { useState, useEffect, useCallback } from "react";
import http from "../utils/http";
import { GET_VILLAGE_CAROUSEL } from "../utils/constants";
export default function Carousel({ onLogin }) {
const SLIDES = [
  {
    carousel_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    carousel_name: "🌄 Welcome",
    carousel_title: ["Where ", "Nature", " Meets Tradition"],
    carousel_desc: "Nestled among emerald hills, our village breathes with ancient stories and vibrant life, connecting every soul to its roots.",
  },
  {
    carousel_image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=80",
    carousel_name: "🌾 Our Fields",
    carousel_title: ["Golden ", "Harvests", " Every Season"],
    carousel_desc: "From paddy fields to coconut groves — the land that feeds and nurtures us all through every generation.",
  },
  {
    carousel_image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1600&q=80",
    carousel_name: "🎉 Culture",
    carousel_title: ["Festivals Full of ", "Joy & Colour", ""],
    carousel_desc: "Our celebrations echo through the hills — music, dance and togetherness binding every family.",
  },
  {
    carousel_image: "https://images.unsplash.com/photo-1601158935942-52255782d322?w=1600&q=80",
    carousel_name: "🏡 Community",
    carousel_title: ["One Village, ", "One Heart", ""],
    carousel_desc: "2,400 souls bound by love, respect and a shared dream for a brighter tomorrow.",
  },
];

const [Slides, setSlides] = useState(SLIDES);
const fetchCarousel = useCallback(async () => {
    try {
      const res = await http.post(GET_VILLAGE_CAROUSEL);
      console.log("Fetched carousel data:", res.data);
      setSlides(res.data);
    } catch (err) {
      console.error("Failed to fetch app name", err);
    }
  }, []);
  useEffect(() => {
    fetchCarousel();
  }, []);

  const [cur, setCur] = useState(0);
  const go = useCallback((n) => setCur((n + Slides.length) % Slides.length), []);
  useEffect(() => {
    const t = setInterval(() => go(cur + 1), 5500);
    return () => clearInterval(t);
  }, [cur, go]);
  return (
    <div className="hero">
      <div className="hero-track" style={{ transform: `translateX(-${cur * 100}%)` }}>
        {Slides.map((s, i) => (
          <div key={i} className={`hslide${i === cur ? " active" : ""}`}>
            <div className="hslide-bg" style={{ backgroundImage: `url('${s.carousel_image}')` }} />
            <div className="hslide-content">
              <div className="h-chip">{s.carousel_name}</div>
              <h1>
                {/* {s.carousel_title[0]}
                <span>{s.carousel_title[1]}</span>
                {s.carousel_title[2]} */}
              </h1>
              <p>{s.carousel_desc}</p>
              <button className="h-cta" onClick={onLogin}>
                Explore Village
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative blob */}
      <div style={{
        position:"absolute",right:"-60px",top:"50%",transform:"translateY(-50%)",
        width:"520px",height:"520px",borderRadius:"50%",pointerEvents:"none",
        background:"radial-gradient(circle,rgba(255,255,255,0.07) 0%,transparent 70%)",zIndex:1
      }} />

      <div className="hero-foot">
        <div className="h-dots">
          {Slides.map((_, i) => (
            <button key={i} className={`h-dot${i === cur ? " active" : ""}`} onClick={() => go(i)} />
          ))}
        </div>
        <div className="h-arrows">
          <button className="h-arr" onClick={() => go(cur - 1)}>←</button>
          <button className="h-arr" onClick={() => go(cur + 1)}>→</button>
        </div>
      </div>
    </div>
  );
}