import React, { useRef, useState, useEffect } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import TruncateMarkup from "react-truncate-markup";
import { Card, CardBody } from "reactstrap";

function BuySellSection({ onLogin, loggedIn }) {

  const buyContainerRef = useRef(null);
  const sellContainerRef = useRef(null);

  const [buyActiveIndex, setBuyActiveIndex] = useState(0);
  const [sellActiveIndex, setSellActiveIndex] = useState(0);

  const [isBuyHovered, setIsBuyHovered] = useState(false);
  const [isSellHovered, setIsSellHovered] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
const [filterType, setFilterType] = useState("ALL");
  


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
    heading: "Need fresh farm eggs",
    description: "Need fresh farm eggs from local farmers,its good for health,highly nutritions added.",
    name: "Govind",
    contact: "9539562001",
    image: "/images/eggsImg.jpg",
    email: "govind@gmail.com"
  },
  {
    id: 2,
    flag: "BUY",
    title: "Cow Milk",
    description: "Looking for fresh cow milk daily",
    heading: "Looking for fresh cow milk daily",
    name: "Rahul",
    image: "/images/milkImg.jpg",
    contact: "9539562002",
    email: "rahul@gmail.com"
  },
  {
    id: 3,
    flag: "BUY",
    title: "Mashrooms",
    description: "Organic mushrooms required",
     heading: "Organic mushrooms required",
    name: "Arun",
    image: "/images/mushroomImg.jpg",
    contact: "9539562003",
    email: "arun@gmail.com"
  },
  {
    id: 4,
    flag: "BUY",
    title: "Fish",
    heading: "Fresh fishes no using chemicals",
    description: "Fresh fishes no using chemicals",
    image: "/images/fishImg.jpg",
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
     heading: "Healthy cow available for sale",
    description: "Healthy cow available for sale",
    name: "Sooraj",
    image: "/images/cowImg.jpg",
    contact: "9539562011",
    email: "sooraj@gmail.com"
  },
  {
    id: 6,
    flag: "SELL",
    title: "4bhk FLAT",
    heading: "Spacious flat available near town",
    description: "Spacious flat available near town.its very scenic place situated in the heart of the city",
    name: "Nikhil",
    image: "/images/flatImg.jpg",
    contact: "9539562012",
    email: "nikhil@gmail.com"
  },
  {
    id:7,
    flag:"SELL",
    title:"ACTIVA SCOOTER 125CC",
    heading: "Working condition, no bargaining",
    image: "/images/scooterImg.jpg",
    description:"working condition, no bargaining ,amount is fixed",
    name:"Anand",
    contact:"6562326562"
  },
  {
    id:8,
    flag:"SELL",
    title:"iphone 17 pro",
    image: "/images/iphone17pro.jpg",
    heading: "Working condition, no damages ,full neet piece",
    description:"working condition, no bargaining ,amount is fixed",
    name:"Gokul",
    contact:"953624523"
  },
];

 const filterItems = (items) => {
  return items.filter((item) => {
    const matchesSearch = `${item.title} ${item.description} ${item.name}`
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesFilter =
      filterType === "ALL" || item.flag === filterType;

    return matchesSearch && matchesFilter;
  });
};

const filteredBuyItems = filterItems(buyItems);
const filteredSellItems = filterItems(sellItems);
const maskContact = (number) => {
  if (!number) return "";
  const str = number.toString();

  return str.slice(0, -5) + "*****";
};

  const CARD_WIDTH = 335;
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
  <Card className="marketCard" key={item.id}>

  <span
    className={`flag ${
      item.flag === "BUY" ? "buyFlag" : "sellFlag"
    }`}
  >
    {item.flag}
  </span>

  <CardBody className="cardBody">

    <div
      className={`buysell-badge ${
        item.flag === "BUY"
          ? "buy-badge"
          : "sell-badge"
      }`}
    >
      {item.title}
    </div>

    <div className="buysell-content">

      {/* Left Side Image */}
      <div className="buysell-avatar">

        <div className="image-bg"></div>

        <img
          src={item.image}
          alt={item.title}
          className="product-image"
        />

      </div>
      

      {/* Right Side Content */}
      <div className="buysell-description">

        <h4 className="product-heading">
          {item.heading}
        </h4>

        <p className="product-desc">
    "{item.description}"
  </p>

        <p className="buysell-name">
          
          -{item.name}
        </p>

        <p
          className="buysell-contact clickable-contact"
          onClick={() => {
            if (!loggedIn) {
              onLogin();
            }
          }}
        >
          <i className="fa fa-phone"></i>

          {loggedIn
            ? item.contact
            : maskContact(item.contact)}
        </p>

      </div>

    </div>

  </CardBody>

</Card>
);
  return (
    <section className="buySellSection">
  <div className="container">
    <h2 className="sectionTitle">🛒 Marketplace</h2>
      {showFilter && (
      <div className="filter-menu">
        <button
          className={filterType === "ALL" ? "active-filter" : ""}
          onClick={() => setFilterType("ALL")}
        >
          All
        </button>

        <button
          className={filterType === "BUY" ? "active-filter" : ""}
          onClick={() => setFilterType("BUY")}
        >
          Buy
        </button>

        <button
          className={filterType === "SELL" ? "active-filter" : ""}
          onClick={() => setFilterType("SELL")}
        >
          Sell
        </button>
      </div>
    )}
    <div className="market-search-row">
      <input
        className="market-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search product, seller or description..."
      />

      <button
        className="filter-btn"
        onClick={() => setShowFilter(!showFilter)}
        title="Filter"
      >
        <i className="fa fa-bars"></i>
      </button>
    </div>

   
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
             {filteredBuyItems.map(renderCard)}
            </div>

            <div className="dotsContainer">
              {filteredBuyItems.map((_, index) => (
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
              {filteredSellItems.map(renderCard)}
            </div>

            <div className="dotsContainer">
              {filteredSellItems.map((_, index) => (
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