import { useState } from "react";
import AddMarketplaceItem from "./AddMarketplaceItem";
export default function ChatWidget({ onAddItem }) {

  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

 const handleAddItem = () => {
  setOpen(false);
  setShowForm(true);
};
const handlePublish = (item) => {
  console.log("New Item:", item);

  // We will save the item in Step 3
  setShowForm(false);
};

  return (
    <div className="chat-widget">

      <button
        className="chat-btn"
        onClick={() => setOpen(!open)}
      >
        <i className="fas fa-plus"></i>
      </button>


      {open && (
        <div className="chat-box">

          <div className="chat-header">
            <span>Marketplace</span>

            <button onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
           

          <div className="chat-body">

            <p>
              Want to Sell or Buy something?
            </p>

            <button
              className="add-market-btn"
              onClick={handleAddItem}
            >
              <i className="fas fa-plus"></i>
              Add Item
            </button>

          </div>

        </div>
      )}
      {showForm && (
  <div className="modal-overlay">
    <div className="modal-content">
      <button
        className="close-btn"
        onClick={() => setShowForm(false)}
      >
        ✕
      </button>

      <AddMarketplaceItem onPublish={handlePublish} />
    </div>
  </div>
)}

    </div>
  );
}