import { useState, useEffect } from "react";

export default function AdvertisementSection() {
  const ads = [
    {
      icon: "🏥",
      image: "/images/Hospital.png",
      tag: "Healthcare",
      title: "Pillai Family Clinic — Now Open 24/7",
      description:
        "Expert doctors, modern lab & pharmacy on site. Walk-in & appointments welcome.",
      button: "📞 Book Now",
    },
    {
      icon: "🏫",
       image: "/images/School.png",
      tag: "Education",
      title: "Gramam High School — Admissions Open",
      description:
       "Enroll now for the new academic year. Scholarships available.",
      button: "Learn More →",
    },
    {
      icon: "🛒",
       image: "/images/Shopping.png",
      tag: "Shopping",
      title: "Hari Super Market — Fresh Daily Deals",
      description:
        "Best prices on groceries, vegetables & essentials.",
      button: "📞 Call Now",
    },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % ads.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [ads.length]);

  return (
    <section className="ad-section">
      <div className="ad-label-bar">
        <span>Advertisement</span>

        <div className="ad-nav-dots">
          {ads.map((_, index) => (
            <button
              key={index}
              className={`ad-nav-dot ${
                active === index ? "active" : ""
              }`}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      </div>

      <div className="ad-section-inner">
        <div
          className="ad-track"
          style={{
            transform: `translateX(-${active * 100}%)`,
          }}
        >
          {ads.map((ad, index) => (
           <div
                className="ad-slide"
                key={index}
                style={{
                    backgroundImage: `url(${ad.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                >
              

              <div className="ad-text">
                <span className="ad-tag">{ad.tag}</span>
                <h3>{ad.title}</h3>
                <p>{ad.description}</p>
              </div>

              <button className="ad-cta-btn">
                {ad.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}