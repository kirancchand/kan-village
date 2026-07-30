import { useState } from "react";

export default function AddMarketplaceItem({ onPublish }) {
  const [formData, setFormData] = useState({
    type: "sell",
    category: "",
    itemName: "",
    description: "",
    price: "",
    location: "",
    contact: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({
        ...formData,
        [name]: Array.from(files),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onPublish(formData);

    setFormData({
      type: "sell",
      category: "",
      itemName: "",
      description: "",
      price: "",
      location: "",
      contact: "",
    });
  };

  return (
    <div className="marketplace-form">
      <form onSubmit={handleSubmit}>
        <h2>📦 Add Marketplace Item</h2>

        <div className="form-grid">
          {/* Item Type */}
          <div className="form-group full-width">
            <label>Item Type</label>

            <div className="radio-group">
              <label className="radio-card">
                <input
                  type="radio"
                  name="type"
                  value="sell"
                  checked={formData.type === "sell"}
                  onChange={handleChange}
                />
                <span>💰 Sell</span>
              </label>

              <label className="radio-card">
                <input
                  type="radio"
                  name="type"
                  value="buy"
                  checked={formData.type === "buy"}
                  onChange={handleChange}
                />
                <span>🛒 Buy</span>
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option>Vehicles</option>
              <option>Electronics</option>
              <option>Furniture</option>
              <option>Property</option>
              <option>Livestock</option>
            </select>
          </div>

          {/* Item Name */}
          <div className="form-group">
            <label>Item Name</label>

            <input
              type="text"
              name="itemName"
              placeholder="Enter Item Name"
              value={formData.itemName}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Describe your item..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price</label>

            <input
              type="number"
              name="price"
              placeholder="₹ Enter Price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              name="location"
              placeholder="Village / Town"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Contact */}
          <div className="form-group full-width">
            <label>Contact Number</label>

            <input
              type="tel"
              name="contact"
              placeholder="Enter Contact Number"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>

          {/* Upload */}
          <div className="form-group full-width">
            <label>Upload Photos</label>

            <label className="upload-box">
              <i className="fas fa-cloud-upload-alt"></i>

              <h3>Upload Images</h3>

              <p>Click here to choose images</p>

              <small>Maximum 5 photos</small>

              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleChange}
                hidden
              />
            </label>

            {formData.images.length > 0 && (
              <div className="preview-container">
                {formData.images.map((image, index) => (
                  <div className="preview-card" key={index}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="publish-btn" type="submit">
          <i className="fas fa-paper-plane"></i> Publish Item
        </button>
      </form>
    </div>
  );
}
