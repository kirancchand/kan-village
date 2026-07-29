import { useState, useEffect, useContext } from "react";
import UserContext from "../UserContext.jsx";
export default function Navbar({ loggedIn, onLogin, onLogout }) {
  const { appName } = useContext(UserContext);
  
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <nav className={`g-nav${scrolled ? " scrolled" : ""}`}>
      <div className="g-brand">
        <div className="g-brand-icon">🌿</div>
        <span className="g-brand-name">{appName}</span>
      </div>
      <div className="g-nav-links">
        <a className="hide-m">Home</a>
        <a className="hide-m">Emergency</a>
        <a className="hide-m">About</a>
        {loggedIn ? (
          <button className="btn-logout" onClick={onLogout}>Sign Out</button>
        ) : (
          <button className="btn-login" onClick={onLogin}>Sign In</button>
        )}
      </div>
    </nav>
  );
}