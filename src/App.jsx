import { useState, useEffect, useCallback,useContext } from "react";

import Carousel from "./Components/Carousel.jsx";
import StatsBand from "./Components/StatsBand.jsx";
import ImportantPersonsSection from "./Components/ImportantPersonsSection.jsx";
import EmergencySection from "./Components/EmergencySection.jsx";
import Footer from "./Components/Footer.jsx";
import CategoriesSection from "./Components/CategoriesSection.jsx";
import ListingsSection from "./Components/ListingsSection.jsx";
import PeopleSection from "./Components/PeopleSection.jsx";
import Navbar from "./Components/Navbar.jsx";
import LoginModal from "./Components/Login.jsx";
import RegisterModal from "./Components/RegisterModal.jsx";
import ForgotPasswordModal from "./Components/ForgotPasswordModal.jsx";
import UserContext from "./UserContext.jsx";
import AdvertisementLogin from "./Components/AdvertisementLogin.jsx";
import AdvertisementSection from "./Components/AdvertisementSection.jsx";

// import "bootstrap/dist/css/bootstrap.min.css";
function PublicPage({ onLogin }) {
  return (
    <>
      <Carousel onLogin={onLogin} />
      <StatsBand />
      {/* <AdvertisementLogin /> */}
      <ImportantPersonsSection />
      <EmergencySection />
      <Footer loggedIn={false} />
    </>
  );
}

/* ─────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────── */
function Dashboard({ onLogout }) {
  const [activeCat, setActiveCat] = useState("all");
   const { appName } = useContext(UserContext);

  const handleFilter = (cat) => {
    setActiveCat(cat);
    setTimeout(() => {
      document.getElementById("listSecAnchor")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      <div className="dash-banner">
        <div className="dash-hello">👋 Welcome, {appName} Resident</div>
        <h1>Village Services Portal</h1>
        <p>Your complete guide — contacts, directories & local services</p>
      </div>
      <AdvertisementSection />
      <CategoriesSection onFilter={handleFilter} />
      <ListingsSection activeCat={activeCat} onFilter={setActiveCat} />
      <PeopleSection />
      <Footer loggedIn onSignOut={onLogout} />
    </>
  );
}

/* ─────────────────────────────────────────
   ROOT APP
───────────────────────────────────────── */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
 

  // Inject CSS once
  useEffect(() => {
    const id = "gramam-styles";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  const login = () => {
    setLoggedIn(true);
    setShowLogin(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logout = () => {
    setLoggedIn(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>

      <Navbar loggedIn={loggedIn} onLogin={() => setShowLogin(true)} onLogout={logout} />
      {loggedIn ? (
        <Dashboard onLogout={logout} />
      ) : (
        <PublicPage onLogin={() => setShowLogin(true)} />
      )}
      {showLogin && (
  <LoginModal
    onClose={() => setShowLogin(false)}
    onSuccess={login}
    onRegister={() => {
      setShowLogin(false);
      setShowRegister(true);
    }}
    onForgotPassword={() => {
    setShowLogin(false);
    setShowForgotPassword(true);
  }}
  />
)}

{showRegister && (
  <RegisterModal
    onClose={() => setShowRegister(false)}
    onLogin={() => {
      setShowRegister(false);
      setShowLogin(true);
    }}
  />
)}

{showForgotPassword && (
  <ForgotPasswordModal
    onClose={() => setShowForgotPassword(false)}
    onBackToLogin={() => {
      setShowForgotPassword(false);
      setShowLogin(true);
    }}
  />
)}

    </>
  );
}
