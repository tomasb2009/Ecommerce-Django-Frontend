import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function ProductCreate() {
  const userData = UserData();
  const vendorId = userData?.vendor_id;

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [shippingAmount, setShippingAmount] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [status, setStatus] = useState("published");
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState(null);

  // Specifications state: array of { title, content }
  const [specifications, setSpecifications] = useState([
    { title: "", content: "" },
  ]);

  // Gallery images state: array of File objects
  const [galleryImages, setGalleryImages] = useState([]);

  // Colors state: array of { name, color_code }
  const [colors, setColors] = useState([{ name: "", color_code: "#000000" }]);

  // Sizes state: array of { name, price }
  const [sizes, setSizes] = useState([{ name: "", price: "" }]);

  useEffect(() => {
    apiInstance
      .get("category/")
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorId) {
      Swal.fire({ icon: "error", text: "Vendor ID not available" });
      return;
    }

    // Validate specifications: if title exists, content must also exist
    const invalidSpecs = specifications.filter(
      (s) => s.title.trim() && !s.content.trim()
    );
    if (invalidSpecs.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid specifications",
        text: "If you provide a specification title, you must also provide its content.",
      });
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("description", description || "");
      if (category) fd.append("category", category);
      fd.append("price", price ? parseFloat(price).toFixed(2) : "0.00");
      fd.append("oldPrice", oldPrice ? parseFloat(oldPrice).toFixed(2) : "0.00");
      fd.append("shipping_amount", shippingAmount ? parseFloat(shippingAmount).toFixed(2) : "0.00");
      fd.append("stock_qty", stockQty ? parseInt(stockQty, 10) : "1");
      fd.append("status", status);
      fd.append("in_stock", inStock ? "true" : "false");
      fd.append("featured", featured ? "true" : "false");
      if (image) fd.append("image", image);

      // Append specifications as JSON (only rows with both title and content)
      const cleanedSpecs = specifications
        .map((s) => ({
          title: (s.title || "").trim(),
          content: (s.content || "").trim(),
        }))
        .filter((s) => s.title && s.content); // Both must be present

      if (cleanedSpecs.length > 0) {
        fd.append("specifications", JSON.stringify(cleanedSpecs));
      }

      // Append gallery images
      galleryImages.forEach((img) => {
        if (img) {
          fd.append("gallery_images", img);
        }
      });

      // Append colors as JSON (only rows with both name and color_code)
      const cleanedColors = colors
        .map((c) => ({
          name: (c.name || "").trim(),
          color_code: (c.color_code || "").trim(),
        }))
        .filter((c) => c.name && c.color_code);

      if (cleanedColors.length > 0) {
        fd.append("colors", JSON.stringify(cleanedColors));
      }

      // Append sizes as JSON (only rows with name)
      const cleanedSizes = sizes
        .map((s) => ({
          name: (s.name || "").trim(),
          price: s.price ? parseFloat(s.price).toFixed(2) : "0.00",
        }))
        .filter((s) => s.name);

      if (cleanedSizes.length > 0) {
        fd.append("sizes", JSON.stringify(cleanedSizes));
      }

      const response = await apiInstance.post(`vendor/products/${vendorId}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({ icon: "success", text: "Product created successfully!" });
      navigate("/vendor/products/");
    } catch (err) {
      console.error("Error creating product:", err);
      const errorMessage = err?.response?.data?.detail 
        || err?.response?.data?.title?.[0] 
        || err?.response?.data?.message 
        || JSON.stringify(err?.response?.data)
        || "Could not create product. Please check all fields.";
      Swal.fire({
        icon: "error",
        title: "Error creating product",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorLayout>
      <main className="mb-5">
        <div className="container px-4">
          <h3 className="mb-3">
            <i className="fas fa-plus-circle text-primary" /> Add Product
          </h3>

          <form className="row rounded shadow p-3" onSubmit={handleSubmit}>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select…</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="published">Published</option>
                        <option value="in_review">In Review</option>
                        <option value="draft">Draft</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Price</label>
                      <input
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Old price</label>
                      <input
                        className="form-control"
                        value={oldPrice}
                        onChange={(e) => setOldPrice(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Shipping amount</label>
                      <input
                        className="form-control"
                        value={shippingAmount}
                        onChange={(e) => setShippingAmount(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Stock quantity</label>
                      <input
                        className="form-control"
                        value={stockQty}
                        onChange={(e) => setStockQty(e.target.value)}
                        type="number"
                      />
                    </div>

                    <div className="col-md-6 mb-3 d-flex align-items-end gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={inStock}
                          onChange={(e) => setInStock(e.target.checked)}
                          id="inStock"
                        />
                        <label className="form-check-label" htmlFor="inStock">
                          In stock
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          id="featured"
                        />
                        <label className="form-check-label" htmlFor="featured">
                          Featured
                        </label>
                      </div>
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Image</label>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                      />
                    </div>

                    {/* Gallery Images */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label d-flex justify-content-between align-items-center">
                        <span>Gallery Images (Multiple)</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.multiple = true;
                            input.onchange = (e) => {
                              const files = Array.from(e.target.files || []);
                              setGalleryImages((prev) => [...prev, ...files]);
                            };
                            input.click();
                          }}
                        >
                          <i className="fas fa-plus me-1" />
                          Add Images
                        </button>
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {galleryImages.map((img, index) => (
                          <div key={index} className="position-relative">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Gallery ${index + 1}`}
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              style={{ transform: "translate(50%, -50%)" }}
                              onClick={() =>
                                setGalleryImages((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                            >
                              <i className="fas fa-times" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label d-flex justify-content-between align-items-center">
                        <span>Colors</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setColors((prev) => [
                              ...prev,
                              { name: "", color_code: "#000000" },
                            ])
                          }
                        >
                          <i className="fas fa-plus me-1" />
                          Add Color
                        </button>
                      </label>
                      {colors.map((color, index) => (
                        <div
                          className="border rounded p-2 mb-2 bg-light"
                          key={index}
                        >
                          <div className="row g-2 align-items-center">
                            <div className="col-md-4">
                              <input
                                className="form-control"
                                placeholder="Color name (e.g. Red)"
                                value={color.name}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setColors((prev) =>
                                    prev.map((c, i) =>
                                      i === index ? { ...c, name: value } : c,
                                    ),
                                  );
                                }}
                              />
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex gap-2 align-items-center">
                                <input
                                  className="form-control"
                                  type="color"
                                  value={color.color_code}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setColors((prev) =>
                                      prev.map((c, i) =>
                                        i === index
                                          ? { ...c, color_code: value }
                                          : c,
                                      ),
                                    );
                                  }}
                                />
                                <input
                                  className="form-control"
                                  placeholder="#000000"
                                  value={color.color_code}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setColors((prev) =>
                                      prev.map((c, i) =>
                                        i === index
                                          ? { ...c, color_code: value }
                                          : c,
                                      ),
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-md-2 d-flex justify-content-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  setColors((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                                disabled={colors.length === 1}
                              >
                                <i className="fas fa-trash" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sizes */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label d-flex justify-content-between align-items-center">
                        <span>Sizes</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setSizes((prev) => [
                              ...prev,
                              { name: "", price: "" },
                            ])
                          }
                        >
                          <i className="fas fa-plus me-1" />
                          Add Size
                        </button>
                      </label>
                      {sizes.map((size, index) => (
                        <div
                          className="border rounded p-2 mb-2 bg-light"
                          key={index}
                        >
                          <div className="row g-2 align-items-center">
                            <div className="col-md-5">
                              <input
                                className="form-control"
                                placeholder="Size name (e.g. Small, M, Large)"
                                value={size.name}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSizes((prev) =>
                                    prev.map((s, i) =>
                                      i === index ? { ...s, name: value } : s,
                                    ),
                                  );
                                }}
                              />
                            </div>
                            <div className="col-md-5">
                              <input
                                className="form-control"
                                placeholder="Additional price (optional)"
                                type="number"
                                step="0.01"
                                value={size.price}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSizes((prev) =>
                                    prev.map((s, i) =>
                                      i === index ? { ...s, price: value } : s,
                                    ),
                                  );
                                }}
                              />
                            </div>
                            <div className="col-md-2 d-flex justify-content-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  setSizes((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                                disabled={sizes.length === 1}
                              >
                                <i className="fas fa-trash" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Specifications */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label d-flex justify-content-between align-items-center">
                        <span>Specifications</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setSpecifications((prev) => [
                              ...prev,
                              { title: "", content: "" },
                            ])
                          }
                        >
                          <i className="fas fa-plus me-1" />
                          Add specification
                        </button>
                      </label>

                      {specifications.map((spec, index) => (
                        <div
                          className="border rounded p-2 mb-2 bg-light"
                          key={index}
                        >
                          <div className="row g-2 align-items-start">
                            <div className="col-md-4">
                              <input
                                className="form-control"
                                placeholder="Title (e.g. Material)"
                                value={spec.title}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSpecifications((prev) =>
                                    prev.map((s, i) =>
                                      i === index ? { ...s, title: value } : s,
                                    ),
                                  );
                                }}
                              />
                            </div>
                            <div className="col-md-7">
                              <input
                                className={`form-control ${
                                  spec.title.trim() && !spec.content.trim()
                                    ? "border-danger"
                                    : ""
                                }`}
                                placeholder="Content (e.g. 100% cotton)"
                                value={spec.content}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSpecifications((prev) =>
                                    prev.map((s, i) =>
                                      i === index
                                        ? { ...s, content: value }
                                        : s,
                                    ),
                                  );
                                }}
                                required={spec.title.trim() ? true : false}
                              />
                              {spec.title.trim() && !spec.content.trim() && (
                                <small className="text-danger">
                                  Content is required when title is provided
                                </small>
                              )}
                            </div>
                            <div className="col-md-1 d-flex justify-content-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  setSpecifications((prev) =>
                                    prev.filter((_, i) => i !== index),
                                  )
                                }
                                disabled={specifications.length === 1}
                              >
                                <i className="fas fa-trash" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="col-12 d-flex gap-2">
                      <button className="btn btn-primary" disabled={loading}>
                        {loading ? "Saving…" : "Create"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/vendor/products/")}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
        </div>
      </main>
    </VendorLayout>
  );
}

export default ProductCreate;

