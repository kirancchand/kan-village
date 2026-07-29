import { useState, useEffect } from "react";

export default function AdvertisementLogin() {
  const ads = [
    {
      image: "/images/tourism.png",
      tag: "Tourism",
      title: "Green Valley Resort",
      description:
        "Experience luxury stays, nature trails and authentic Kerala cuisine.",
      button: "Book Now",
    },
    {
      image: "/images/bank.jpg",
      tag: "Finance",
      title: "Village Co-operative Bank",
      description:
        "Easy loans, savings accounts and digital banking services.",
      button: "Apply Today",
    },
    {
      image: "/images/shop.jpg",
      tag: "Shopping",
      title: "Gramam Mega Shopping Festival",
      description:
        "Exclusive offers on electronics, fashion and home essentials.",
      button: "View Offers",
    },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="large-ad-section">
      <div
        className="large-ad-track"
        style={{
          transform: `translateX(-${active * 100}%)`,
        }}
      >
        {ads.map((ad, index) => (
          <div
            key={index}
            className="large-ad-slide"
            style={{
              backgroundImage:`
    linear-gradient(
      to right,
      rgba(0,0,0,0.75),
      rgba(0,0,0,0.35),
      transparent
    ),
    url(${ad.image})
  `,
            }}
          >
            <div className="large-ad-overlay "></div>

            <div className="large-ad-content">
              <span>{ad.tag}</span>
              <h2>{ad.title}</h2>
              <p>{ad.description}</p>

              <button>{ad.button}</button>
            </div>
          </div>
        ))}
      </div>

      <div className="large-ad-dots">
        {ads.map((_, index) => (
          <button
            key={index}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  );
}