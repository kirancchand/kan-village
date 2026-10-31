import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserContext from "../UserContext.jsx";

export default function Navbar({ loggedIn, onLogin, onLogout }) {
  const { appName } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (path, hash) => {
    if (location.pathname !== path) {
      navigate(path);
      if (hash) {
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (hash) {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const isMarketplace = location.pathname === "/marketplace";

  return (
    <nav className={`g-nav${scrolled ? " scrolled" : ""}`}>
      <div className="g-brand" onClick={() => handleNavClick("/")} style={{ cursor: "pointer" }}>
        <div className="g-brand-icon">🌿</div>
        <span className="g-brand-name">{appName}</span>
      </div>

      <div className="g-nav-links">
        <a
          className="hide-m"
          style={{ cursor: "pointer" }}
          onClick={() => handleNavClick("/")}
        >
          Home
        </a>

        <a
          className="hide-m"
          style={{ cursor: "pointer" }}
          onClick={() => handleNavClick("/marketplace")}
        >
          Marketplace
        </a>

        <a
          className="hide-m"
          style={{ cursor: "pointer" }}
          onClick={() => handleNavClick("/", "#emergency")}
        >
          Emergency
        </a>

        <a
          className="hide-m"
          style={{ cursor: "pointer" }}
          onClick={() => {
            const footerEl = document.querySelector("footer");
            if (footerEl) footerEl.scrollIntoView({ behavior: "smooth" });
          }}
        >
          About
        </a>

        {/* Back to Home button shown next to Sign Out / Sign In when on Marketplace */}
        {isMarketplace && (
          <button
            className="btn-login"
            onClick={() => navigate("/")}
            style={{
              marginRight: "8px",
              background: scrolled ? "rgba(15, 118, 110, 0.1)" : "rgba(255, 255, 255, 0.2)",
              borderColor: scrolled ? "#0f766e" : "rgba(255, 255, 255, 0.5)",
              color: scrolled ? "#0f766e" : "#fff",
            }}
          >
            ← Back to Home
          </button>
        )}

        {loggedIn ? (
          <button className="btn-logout" onClick={onLogout}>Sign Out</button>
        ) : (
          <button className="btn-login" onClick={onLogin}>Sign In</button>
        )}
      </div>
    </nav>
  );
}