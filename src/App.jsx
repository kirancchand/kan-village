import { useState, useEffect, useCallback, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import MarketplacePage from "./Components/MarketplacePage.jsx";
import ProductDetailPage from "./Components/ProductDetailPage.jsx";
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
import BuySellSection from "./Components/BuySellSection.jsx";
import ChatWidget from "./Components/ChatWidget";
import { getAccessToken,requestAppData } from "./utils/http.jsx";

function PublicPage({ onLogin, loggedIn }) {
  return (
    <>
      <Carousel onLogin={onLogin} />
      <StatsBand />
      <AdvertisementSection />
      <ImportantPersonsSection />
      <EmergencySection />
      <BuySellSection onLogin={onLogin} loggedIn={loggedIn} />
      <Footer loggedIn={false} />
    </>
  );
}

/* ─────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────── */
function Dashboard({ onLogout, onLogin }) {
  const [activeCat, setActiveCat] = useState("all");
  const { appName } = useContext(UserContext);

  const handleFilter = (cat) => {
    setActiveCat(cat);
    setTimeout(() => {
      document
        .getElementById("listSecAnchor")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      <div className="dash-banner">
        <div className="dash-hello">👋 Welcome, {appName} Resident</div>
        <h1>Village Services Portal</h1>
        <p>Your complete guide — contacts, directories & local services</p>
      </div>
      <AdvertisementLogin />
      {/* <CategoriesSection onFilter={handleFilter} /> */}
      <ListingsSection activeCat={activeCat} onFilter={setActiveCat} />
      <PeopleSection />
      <BuySellSection onLogin={onLogin} loggedIn={true} />
      <ChatWidget />
      <Footer loggedIn onSignOut={onLogout} />
    </>
  );
}

/* ─────────────────────────────────────────
   ROOT APP
───────────────────────────────────────── */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(getAccessToken()!== null?true:false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Inject CSS once
  useEffect(() => {
    requestAppData();
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
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setLoggedIn(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const homeView = loggedIn ? (
    <Dashboard onLogout={logout} onLogin={() => setShowLogin(true)} />
  ) : (
    <PublicPage onLogin={() => setShowLogin(true)} loggedIn={loggedIn} />
  );

  return (
    <>
      <Navbar
        loggedIn={loggedIn}
        onLogin={() => setShowLogin(true)}
        onLogout={logout}
      />
      
      <Routes>
        <Route path="/" element={homeView} />
        <Route
          path="/marketplace"
          element={
            <MarketplacePage
              onLogin={() => setShowLogin(true)}
              loggedIn={loggedIn}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetailPage
              onLogin={() => setShowLogin(true)}
              loggedIn={loggedIn}
            />
          }
        />
        <Route path="*" element={homeView} />
      </Routes>
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
