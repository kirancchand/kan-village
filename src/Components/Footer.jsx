import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext.jsx";

export default function Footer({ onSignOut, loggedIn, onLogin }) {
  const { appName } = useContext(UserContext);
  const navigate = useNavigate();

  const handleNav = (path, hash) => {
    navigate(path);
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer>
      <div className="ft-inner">
        <div className="ft-brand" onClick={() => handleNav("/")} style={{ cursor: "pointer" }}>
          <div className="ft-brand-icon">🌿</div>
          <span className="ft-brand-name">{appName}</span>
        </div>
        <div className="ft-links">
          <a onClick={() => handleNav("/")} style={{ cursor: "pointer" }}>Home</a>
          <a onClick={() => handleNav("/marketplace")} style={{ cursor: "pointer" }}>Marketplace</a>
          <a onClick={() => handleNav("/", "#emergency")} style={{ cursor: "pointer" }}>Emergency</a>
          <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ cursor: "pointer" }}>About</a>
          {loggedIn ? (
            <a onClick={onSignOut} style={{ cursor: "pointer" }}>Sign Out</a>
          ) : (
            <a onClick={onLogin} style={{ cursor: "pointer" }}>Sign In</a>
          )}
        </div>
      </div>
      <div className="ft-bot">© 2025 {appName} · Village Portal · All rights reserved</div>
    </footer>
  );
}