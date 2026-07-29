import React, { useRef, useState, useEffect } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import TruncateMarkup from "react-truncate-markup";
import { useNavigate } from "react-router-dom";

function BuySellSection() {
  const buyContainerRef = useRef(null);
  const sellContainerRef = useRef(null);

  const [buyActiveIndex, setBuyActiveIndex] = useState(0);
  const [sellActiveIndex, setSellActiveIndex] = useState(0);

  const [isBuyHovered, setIsBuyHovered] = useState(false);
  const [isSellHovered, setIsSellHovered] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const navigate = useNavigate();


const toggleDescription = (id) => {
  setExpandedCards((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

  const buyItems = [
  {
    id: 1,
    flag: "BUY",
    title: "White Eggs",
    description: "Need fresh farm eggs from local farmers,its good for health,highly nutritions added.",
    name: "Govind",
    contact: "9539562001",
    email: "govind@gmail.com"
  },
  {
    id: 2,
    flag: "BUY",
    title: "Cow Milk",
    description: "Looking for fresh cow milk daily",
    name: "Rahul",
    contact: "9539562002",
    email: "rahul@gmail.com"
  },
  {
    id: 3,
    flag: "BUY",
    title: "Mashrooms",
    description: "Organic mushrooms required",
    name: "Arun",
    contact: "9539562003",
    email: "arun@gmail.com"
  },
  {
    id: 4,
    flag: "BUY",
    title: "Fish",
    description: "Fresh fishes no using chemicals",
    name: "Kumaran",
    contact: "953956421",
    email: "kumaran@gmail.com"
  },
];

  const sellItems = [
  {
    id: 5,
    flag: "SELL",
    title: "Cow",
    description: "Healthy cow available for sale",
    name: "Sooraj",
    contact: "9539562011",
    email: "sooraj@gmail.com"
  },
  {
    id: 6,
    flag: "SELL",
    title: "4bhk FLAT",
    description: "Spacious flat available near town.its very scenic place situated in the heart of the city",
    name: "Nikhil",
    contact: "9539562012",
    email: "nikhil@gmail.com"
  },
  {
    id:7,
    flag:"SELL",
    title:"ACTIVA SCOOTER 125CC",
    description:"working condition, no bargaining ,amount is fixed",
    name:"Anand",
    contact:"6562326562"
  },
  {
    id:8,
    flag:"SELL",
    title:"ACTIVA SCOOTER 125CC",
    description:"working condition, no bargaining ,amount is fixed",
    name:"Anand",
    contact:"953624523"
  },
];
const maskContact = (number) => {
  if (!number) return "";
  const str = number.toString();

  return str.slice(0, -5) + "*****";
};

  const CARD_WIDTH = 200;
  const GAP = 25;

  const scrollToIndex = (ref, index) => {
    if (ref.current) {
      const targetScroll = index * (CARD_WIDTH + GAP);
      ref.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (ref, setActiveIndex) => {
    if (ref.current) {
      const index = Math.round(ref.current.scrollLeft / (CARD_WIDTH + GAP));
      setActiveIndex(index);
    }
  };

  // 1. BUY CAROUSEL -> MOVES TO THE LEFT (0 -> 1 -> 2 -> 3...)
  useEffect(() => {
    if (isBuyHovered) return;

    const interval = setInterval(() => {
      setBuyActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % buyItems.length;
        scrollToIndex(buyContainerRef, nextIndex);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isBuyHovered, buyItems.length]);

  // 2. SELL CAROUSEL -> MOVES TO THE RIGHT (Starts from end or decrements index)
  useEffect(() => {
    if (isSellHovered) return;

    const interval = setInterval(() => {
      setSellActiveIndex((prevIndex) => {
        // Decrements to scroll backwards/rightwards
        const nextIndex = prevIndex - 1 < 0 ? sellItems.length - 1 : prevIndex - 1;
        scrollToIndex(sellContainerRef, nextIndex);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSellHovered, sellItems.length]);
const renderCard = (item) => (
  <div className="marketCard" key={item.id}>
    
    <span className={`flag ${item.flag === "BUY" ? "buyFlag" : "sellFlag"}`}>
      {item.flag}
    </span>

    <div className="cardBody">

      <div
  className={`buysell-badge ${
    item.flag === "BUY" ? "buy-badge" : "sell-badge"
  }`}
>
  {item.title}
</div>

      <div className="buysell-content">

  <div className="buysell-avatar">
    <i className="fa fa-user"></i>
  </div>

 <div className="buysell-description">

{
expandedCards[item.id] ? (
  <>
    <p>"{item.description}"</p>

    <span
      className="show-more-link"
      onClick={() => toggleDescription(item.id)}
    >
      Show Less
    </span>
  </>
)
:
(
  <TruncateMarkup
    lines={2}
    ellipsis={
      <span>
        ...
        <span
          className="show-more-link"
          onClick={() => toggleDescription(item.id)}
        >
          Show More →
        </span>
      </span>
    }
  >
    <p>"{item.description}"</p>
  </TruncateMarkup>
)
}


<p className="buysell-name fw-bold">
  - {item.name}
</p>

<p
  className="buysell-contact clickable-contact"
  onClick={() => navigate("/login")}
  title="Login to view contact number"
>
  {maskContact(item.contact)}
</p>

</div>

</div>

    </div>

  </div>
);
  return (
    <section className="buySellSection">
      <div className="container">
        <h2 className="sectionTitle">🛒 Marketplace</h2>

        {/* BUY SECTION (Moves Left) */}
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
              {buyItems.map(renderCard)}
            </div>

            <div className="dotsContainer">
              {buyItems.map((_, index) => (
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
        </div>

        {/* SELL SECTION (Moves Right) */}
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
              {sellItems.map(renderCard)}
            </div>

            <div className="dotsContainer">
              {sellItems.map((_, index) => (
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
        </div>

      </div>
    </section>
  );
}

export default BuySellSection;