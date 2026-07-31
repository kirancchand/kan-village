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

  if (name === "images") {

    const selectedImages = Array.from(files);

    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...selectedImages
      ].slice(0, 5)
    }));

  } else {

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

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
      images: [],
    });
  };

  return (
    <form className="marketplace-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* Item Type */}
        <div className="form-group full-width">
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
        <div className="form-group category-field">
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
        <div className="form-group itemname-field">
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
          <textarea
            name="description"
            placeholder="Describe your item..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <input
            name="price"
            placeholder="₹ Enter Price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <input
            type="text"
            name="location"
            placeholder="Village / Town"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        {/* Upload */}
        <div className="form-group full-width">
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
          alt="preview"
        />

        <button
          type="button"
          className="remove-image"
          onClick={() => {
            const updatedImages = formData.images.filter(
              (_, i) => i !== index
            );

            setFormData({
              ...formData,
              images: updatedImages
            });
          }}
        >
          ✕
        </button>

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
  );
}
