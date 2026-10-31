import { useState, useRef } from "react";
import AddMarketplaceItem from "./AddMarketplaceItem";
import { ADD_MARKET_PRODUCT_ITEM } from "../utils/constants";
import http from "../utils/http";

export default function ChatWidget() {

  const [open, setOpen] = useState(false);

  const chatBodyRef = useRef(null);
  const handlePublish = async (item) => {
    console.log("New Item:", item);
    try {
      const formDataToSend = new FormData();
      Object.keys(item).forEach((key) => {
        if (key === "product_images") {
          if (Array.isArray(item[key])) {
            item[key].forEach((file) => {
              formDataToSend.append("product_images", file);
            });
          }
        } else if (item[key] !== undefined && item[key] !== null) {
          formDataToSend.append(key, item[key]);
        }
      });

      const res = await http.post(ADD_MARKET_PRODUCT_ITEM, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200 || res.status === 201) {
        console.log("Saved Product Data");
        setOpen(false);
      }
    } catch (err) {
      console.error("Failed to add data", err);
    }
  };
  const scrollToBottom = () => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  };


  return (
    <div className="chat-widget">


      {/* Floating Button */}
      <button
        className="chat-btn"
        onClick={() => setOpen(!open)}
      >
        <i className="fas fa-plus"></i>
      </button>



      {/* Chat Box */}
      {open && (

        <div className="chat-box marketplace-chat">


          <div className="chat-header">

            <span>
              📦 Marketplace
            </span>

            <button
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

          </div>



          <div
            className="chat-body"
            ref={chatBodyRef}
          >

            <AddMarketplaceItem
              onPublish={handlePublish}
            />

          </div>

        </div>

      )}

    </div>
  );
}