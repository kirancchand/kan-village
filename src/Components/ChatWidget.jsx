import { useState, useRef } from "react";
import AddMarketplaceItem from "./AddMarketplaceItem";

export default function ChatWidget() {

  const [open, setOpen] = useState(false);

const chatBodyRef = useRef(null);
  const handlePublish = (item) => {
    console.log("New Item:", item);

    // API save later
    setOpen(false);
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