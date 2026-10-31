import { useState } from "react";

export default function AddMarketplaceItem({ onPublish }) {
  const [formData, setFormData] = useState({
    type: "sell",
    category_id: "",
    category_name: "",
    product_name: "",
    product_desc: "",
    price: "",
    location: "",
    // contact: "",
    product_images: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "product_images") {
      const selectedImages = Array.from(files);

      setFormData((prev) => ({
        ...prev,
        product_images: [
          ...prev.product_images,
          ...selectedImages
        ].slice(0, 5)
      }));
    } else if (name === "category_id") {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const categoryName = selectedOption.getAttribute("data-name") || (selectedOption.value ? selectedOption.text : "");
      setFormData((prev) => ({
        ...prev,
        category_id: value,
        category_name: categoryName
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
      category_id: "",
      category_name: "",
      product_name: "",
      product_desc: "",
      price: "",
      location: "",
      // contact: "",
      product_images: [],
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
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="1" data-name="Vehicles">Vehicles</option>
            <option value="2" data-name="Electronics">Electronics</option>
            <option value="3" data-name="Furniture">Furniture</option>
            <option value="4" data-name="Property">Property</option>
            <option value="5" data-name="Livestock">Livestock</option>
          </select>
        </div>

        {/* Item Name */}
        <div className="form-group itemname-field">
          <input
            type="text"
            name="product_name"
            placeholder="Enter Item Name"
            value={formData.product_name}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <textarea
            name="product_desc"
            placeholder="Describe your item..."
            value={formData.product_desc}
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

        {/* Contact */}
        {/* <div className="form-group">
          <input
            type="text"
            name="contact"
            placeholder="Contact Number / Details"
            value={formData.contact}
            onChange={handleChange}
          />
        </div> */}

        {/* Upload */}
        <div className="form-group full-width">
          <label className="upload-box">
            <i className="fas fa-cloud-upload-alt"></i>

            <h3>Upload Images</h3>

            <p>Click here to choose images</p>

            <small>Maximum 5 photos</small>

            <input
              type="file"
              name="product_images"
              multiple
              accept="image/*"
              onChange={handleChange}
              hidden
            />
          </label>
          {formData.product_images.length > 0 && (
            <div className="preview-container">

              {formData.product_images.map((image, index) => (

                <div className="preview-card" key={index}>

                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                  />

                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      const updatedImages = formData.product_images.filter(
                        (_, i) => i !== index
                      );

                      setFormData({
                        ...formData,
                        product_images: updatedImages
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

