import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import apiInstante from "../../utils/axios";
import GetCurrentAddress from "../plugins/UserCountry";
import UserData from "../plugins/UserData";
import CartID from "../plugins/CartID";
import { CartContext } from "../plugins/Context";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

function ProductDetail() {
  const [product, setProduct] = useState({});
  const [specifications, setSpecifications] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);

  const { cartCount = 0, setCartCount } = useContext(CartContext) ?? {};

  const param = useParams();
  const currentAddress = GetCurrentAddress();
  const userData = UserData();
  const cart_id = CartID();

  const [colorValue, setColorValue] = useState("No Color");
  const [sizeValue, setSizeValue] = useState("No Size");
  const [qtyValue, setQtyValue] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  
  // Carousel state for gallery images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchReviews = () => {
    if (!product?.id) return;
    apiInstante
      .get(`reviews/${product.id}/`)
      .then((res) => {
        setReviews(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    apiInstante.get(`products/${param.slug}/`).then((res) => {
      setProduct(res.data);
      setSpecifications(res.data.specification || []);
      setGallery(res.data.gallery || []);
      setColor(res.data.color || []);
      setSize(res.data.size || []);
      setCurrentImageIndex(0); // Reset carousel to first image
    });
  }, [param.slug]);

  const handleColorButtonClick = (e) => {
    const colorNameInput = e.target
      .closest(".color_button")
      .parentNode.querySelector(".color_name");
    setColorValue(colorNameInput.value);
  };

  const handleSizeButtonClick = (e) => {
    const sizeNameInput = e.target
      .closest(".size_button")
      .parentNode.querySelector(".size_name");
    setSizeValue(sizeNameInput.value);
  };

  const handleQuantityButtonClick = (e) => {
    setQtyValue(e.target.value);
  };

  const handleAddToCart = async () => {
    if (!product?.id) {
      Toast.fire({
        icon: "error",
        title: "Producto no disponible",
      });
      return;
    }

    if (!cart_id) {
      Toast.fire({
        icon: "error",
        title: "Error al inicializar el carrito",
      });
      return;
    }

    // Validar que el producto esté en stock
    if (!product.in_stock) {
      Toast.fire({
        icon: "warning",
        title: "Producto fuera de stock",
      });
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append("product_id", product.id);
      formdata.append("user_id", userData?.user_id ?? "");
      formdata.append("qty", qtyValue);
      formdata.append("price", product.price);
      formdata.append("shipping_amount", product.shipping_amount || 0);
      // Usar país por defecto si currentAddress no está disponible aún
      formdata.append("country", currentAddress?.country || "US");
      formdata.append("size", sizeValue);
      formdata.append("color", colorValue);
      formdata.append("cart_id", cart_id);

      await apiInstante.post("cart-view/", formdata);

      // Actualizar el contador del carrito
      const url = userData?.user_id
        ? `cart-list/${cart_id}/${userData.user_id}/`
        : `cart-list/${cart_id}/`;
      const res = await apiInstante.get(url);
      const total = Array.isArray(res.data)
        ? res.data.reduce((sum, item) => sum + (Number(item.qty) || 0), 0)
        : 0;
      setCartCount?.(total);

      Toast.fire({
        icon: "success",
        title: "Agregado al carrito",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage = error?.response?.data?.message 
        || error?.response?.data?.detail 
        || "No se pudo agregar al carrito";
      
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (product?.id) fetchReviews();
  }, [product?.id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess(false);
    if (!userData?.user_id) {
      setReviewError("Inicia sesión para dejar una reseña.");
      return;
    }
    const text = reviewText.trim();
    if (!text) {
      setReviewError("Escribe tu reseña.");
      return;
    }
    if (!product?.id) return;
    setReviewSubmitting(true);
    try {
      await apiInstante.post(`reviews/${product.id}/`, {
        user_id: userData.user_id,
        rating: Number(reviewRating),
        review: text,
      });
      setReviewText("");
      setReviewRating(5);
      setReviewSuccess(true);
      fetchReviews();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "No se pudo enviar la reseña.";
      setReviewError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const formatReviewDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  return (
    <>
      <main className="mb-4 mt-4">
        <div className="container">
          {/* Section: Product details */}
          <section className="mb-9">
            <div className="row gx-lg-5">
              <div className="col-md-6 mb-4 mb-md-0">
                {/* Gallery Carousel */}
                <div className="">
                  {/* Combine main product image with gallery images */}
                  {(() => {
                    const allImages = [
                      { image: product.image, id: "main" },
                      ...(gallery || []),
                    ].filter((img) => img.image); // Filter out empty images

                    if (allImages.length === 0) return null;

                    const currentImage = allImages[currentImageIndex] || allImages[0];

                    return (
                      <>
                        <div className="position-relative mb-3">
                          <img
                            src={currentImage.image}
                            style={{
                              width: "100%",
                              height: 500,
                              objectFit: "cover",
                              borderRadius: 10,
                            }}
                            alt={`Imagen del producto ${currentImageIndex + 1}`}
                            className="w-100 rounded-4"
                          />
                          {/* Navigation arrows */}
                          {allImages.length > 1 && (
                            <>
                              <button
                                type="button"
                                className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
                                style={{
                                  borderRadius: "50%",
                                  width: 40,
                                  height: 40,
                                  marginLeft: 10,
                                }}
                                onClick={() =>
                                  setCurrentImageIndex((prev) =>
                                    prev === 0 ? allImages.length - 1 : prev - 1
                                  )
                                }
                              >
                                <i className="fas fa-chevron-left" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
                                style={{
                                  borderRadius: "50%",
                                  width: 40,
                                  height: 40,
                                  marginRight: 10,
                                }}
                                onClick={() =>
                                  setCurrentImageIndex((prev) =>
                                    prev === allImages.length - 1 ? 0 : prev + 1
                                  )
                                }
                              >
                                <i className="fas fa-chevron-right" />
                              </button>
                            </>
                          )}
                          {/* Image indicator dots */}
                          {allImages.length > 1 && (
                            <div
                              className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2"
                              style={{ zIndex: 10 }}
                            >
                              {allImages.map((_, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  className={`btn btn-sm rounded-circle ${
                                    index === currentImageIndex
                                      ? "btn-primary"
                                      : "btn-light"
                                  }`}
                                  style={{
                                    width: 10,
                                    height: 10,
                                    padding: 0,
                                  }}
                                  onClick={() => setCurrentImageIndex(index)}
                                  aria-label={`Ir a la imagen ${index + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Thumbnail gallery */}
                        {allImages.length > 1 && (
                          <div className="d-flex gap-2 overflow-auto pb-2">
                            {allImages.map((img, index) => (
                              <button
                                key={img.id || index}
                                type="button"
                                className={`border rounded p-0 ${
                                  index === currentImageIndex
                                    ? "border-primary border-2"
                                    : "border-secondary"
                                }`}
                                style={{
                                  minWidth: 80,
                                  height: 80,
                                  overflow: "hidden",
                                  cursor: "pointer",
                                  background: "none",
                                }}
                                onClick={() => setCurrentImageIndex(index)}
                              >
                                <img
                                  src={img.image}
                                  alt={`Miniatura ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                {/* Gallery Carousel */}
              </div>
              <div className="col-md-6 mb-4 mb-md-0">
                {/* Details */}
                <div>
                  <h1 className="fw-bold mb-3">{product.title}</h1>
                  <div className="d-flex text-primary align-items-center">
                    <ul
                      className="mb-3 d-flex p-0 align-items-center"
                      style={{ listStyle: "none" }}
                    >
                      <li className="d-flex">
                        {(() => {
                          const avg =
                            reviews.length > 0
                              ? reviews.reduce(
                                  (s, r) => s + (r.rating || 0),
                                  0,
                                ) / reviews.length
                              : product.product_rating;
                          const rounded =
                            avg != null ? Math.round(Number(avg)) : 0;
                          return [1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`fas fa-star fa-sm ps-0 ${
                                star <= rounded
                                  ? "text-warning"
                                  : "text-secondary opacity-50"
                              }`}
                              aria-hidden
                            />
                          ));
                        })()}
                      </li>
                      <li style={{ marginLeft: 10, fontSize: 13 }}>
                        <span className="text-dark">
                          <strong className="me-2">
                            {reviews.length > 0
                              ? (
                                  reviews.reduce(
                                    (s, r) => s + (r.rating || 0),
                                    0,
                                  ) / reviews.length
                                ).toFixed(1)
                              : product.product_rating != null
                                ? Number(product.product_rating).toFixed(1)
                                : "0"}
                            /5
                          </strong>
                          (
                          {reviews.length > 0
                            ? reviews.length
                            : (product.rating_count ?? 0)}{" "}
                          reseña
                          {(reviews.length > 0
                            ? reviews.length
                            : (product.rating_count ?? 0)) !== 1
                            ? "s"
                            : ""}
                          )
                        </span>
                      </li>
                    </ul>
                  </div>
                  <h5 className="mb-3">
                    <s className="text-muted me-2 small align-middle">
                      ${product.oldPrice}
                    </s>
                    <span className="align-middle">${product.price}</span>
                  </h5>
                  <p className="text-muted">{product.description}</p>
                  <div className="table-responsive">
                    <table className="table table-sm table-borderless mb-0">
                      <tbody>
                        <tr>
                          <th className="ps-0 w-25" scope="row">
                            <strong>Categoría</strong>
                          </th>
                          <td>{product.category?.title}</td>
                        </tr>
                        {specifications.map((s, index) => (
                          <tr key={index}>
                            <th className="ps-0 w-25" scope="row">
                              <strong>{s.title}</strong>
                            </th>
                            <td>{s.content}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <hr className="my-5" />
                  <div action="">
                    <div className="row flex-column">
                      {/* Quantity */}
                      <div className="col-md-6 mb-4">
                        <div className="form-outline">
                          <label className="form-label" htmlFor="typeNumber">
                            <b>Cantidad</b>
                          </label>
                          <input
                            type="number"
                            id="typeNumber"
                            className="form-control quantity"
                            min={1}
                            value={qtyValue}
                            onChange={handleQuantityButtonClick}
                          />
                        </div>
                      </div>

                      {size.length > 0 && (
                        <>
                          <div className="col-md-6 mb-4">
                            <div className="d-flex">
                              <label
                                className="form-label"
                                htmlFor="typeNumber"
                              >
                                <b>Talla:</b>{" "}
                                <span>
                                  {sizeValue === "No Size" ? "Sin talla" : sizeValue}
                                </span>
                              </label>
                              {size?.map((s, index) => (
                                <div>
                                  <input
                                    type="hidden"
                                    className="size_name"
                                    value={s.name}
                                  />
                                  <button
                                    type="button"
                                    onClick={handleSizeButtonClick}
                                    key={index}
                                    className="btn btn-secondary  m-2 size_button"
                                    style={{ backgroundColor: "gray" }}
                                  >
                                    {s.name}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Colors */}

                      {color.length > 0 && (
                        <>
                          <div className="col-md-6 mb-4">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="typeNumber"
                              >
                                <b>Color:</b>{" "}
                                <span>
                                  {colorValue === "No Color"
                                    ? "Sin color"
                                    : colorValue}
                                </span>
                              </label>
                            </div>
                            <div className="d-flex">
                              {color?.map((c, index) => (
                                <div>
                                  <input
                                    type="hidden"
                                    className="color_name"
                                    value={c.name}
                                  />
                                  <button
                                    type="button"
                                    onClick={handleColorButtonClick}
                                    className="btn  p-3 ms-2 color_button"
                                    style={{
                                      backgroundColor: `${c.color_code}`,
                                    }}
                                  ></button>
                                </div>
                              ))}
                            </div>
                            <hr />
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-rounded me-2"
                      onClick={handleAddToCart}
                    >
                      <i className="fas fa-cart-plus me-2" /> Agregar al carrito
                    </button>
                    <button
                      href="#!"
                      type="button"
                      className="btn btn-danger btn-floating"
                      data-mdb-toggle="tooltip"
                      title="Agregar a favoritos"
                    >
                      <i className="fas fa-heart" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <hr />
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Especificaciones
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                Vendedor
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-contact-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-contact"
                type="button"
                role="tab"
                aria-controls="pills-contact"
                aria-selected="false"
              >
                Reseñas
              </button>
            </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
              tabIndex={0}
            >
              <div className="table-responsive">
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr>
                      <th className="ps-0 w-25" scope="row">
                        <strong>Categoría</strong>
                      </th>
                      <td>{product.category?.title}</td>
                    </tr>
                    {specifications.map((s, index) => (
                      <tr key={index}>
                        <th className="ps-0 w-25" scope="row">
                          <strong>{s.title}</strong>
                        </th>
                        <td>{s.content}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
              tabIndex={0}
            >
              <div className="card mb-3" style={{ maxWidth: 400 }}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      alt="Imagen de usuario"
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">John Doe</h5>
                      <p className="card-text">Desarrollador frontend</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
              tabIndex={0}
            >
              <div className="container mt-5">
                <div className="row">
                  <div className="col-md-6">
                    <h2 className="mb-4">Escribe una reseña</h2>
                    {!userData?.user_id ? (
                      <p className="text-muted">
                        Inicia sesión para poder dejar una reseña.
                      </p>
                    ) : (
                      <form onSubmit={handleSubmitReview}>
                        <div className="mb-3">
                          <label htmlFor="reviewRating" className="form-label">
                            Valoración
                          </label>
                          <select
                            id="reviewRating"
                            className="form-select"
                            value={reviewRating}
                            onChange={(e) =>
                              setReviewRating(Number(e.target.value))
                            }
                          >
                            <option value={1}>1 estrella</option>
                            <option value={2}>2 estrellas</option>
                            <option value={3}>3 estrellas</option>
                            <option value={4}>4 estrellas</option>
                            <option value={5}>5 estrellas</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="reviewText" className="form-label">
                            Reseña
                          </label>
                          <textarea
                            id="reviewText"
                            className="form-control"
                            rows={4}
                            placeholder="Cuéntanos qué te pareció el producto..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            disabled={reviewSubmitting}
                          />
                        </div>
                        {reviewError && (
                          <div className="alert alert-danger py-2 mb-2">
                            {reviewError}
                          </div>
                        )}
                        {reviewSuccess && (
                          <div className="alert alert-success py-2 mb-2">
                            Reseña publicada correctamente.
                          </div>
                        )}
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={reviewSubmitting}
                        >
                          {reviewSubmitting ? "Enviando…" : "Enviar reseña"}
                        </button>
                      </form>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h2 className="mb-4">Reseñas</h2>
                    {!(Array.isArray(reviews) && reviews.length) ? (
                      <p className="text-muted">
                        Aún no hay reseñas. ¡Sé el primero en opinar!
                      </p>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {(Array.isArray(reviews) ? reviews : []).map(
                          (r, index) => (
                            <div
                              className="card mb-0"
                              key={r.id != null ? r.id : index}
                            >
                              <div className="card-body">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <div className="flex-shrink-0">
                                    <img
                                      src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=80"
                                      alt=""
                                      className="rounded-circle"
                                      style={{
                                        width: 40,
                                        height: 40,
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <h6 className="card-title mb-0">
                                      {r.user?.full_name ||
                                        r.user?.username ||
                                        "Usuario"}
                                    </h6>
                                    <small className="text-muted">
                                      {formatReviewDate(r.date)}
                                    </small>
                                  </div>
                                  <div className="ms-auto">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <i
                                        key={star}
                                        className={`fas fa-star fa-sm ${
                                          star <= (r.rating || 0)
                                            ? "text-warning"
                                            : "text-secondary opacity-50"
                                        }`}
                                        aria-hidden
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="card-text mb-0">{r.review}</p>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-disabled"
              role="tabpanel"
              aria-labelledby="pills-disabled-tab"
              tabIndex={0}
            >
              <div className="container mt-5">
                <div className="row">
                  {/* Column 1: Form to submit new questions */}
                  <div className="col-md-6">
                    <h2>Haz una pregunta</h2>
                    <form>
                      <div className="mb-3">
                        <label htmlFor="askerName" className="form-label">
                          Tu nombre
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="askerName"
                          placeholder="Escribe tu nombre"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="questionText" className="form-label">
                          Pregunta
                        </label>
                        <textarea
                          className="form-control"
                          id="questionText"
                          rows={4}
                          placeholder="Escribe tu pregunta"
                          defaultValue={""}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Enviar pregunta
                      </button>
                    </form>
                  </div>
                  {/* Column 2: Display existing questions and answers */}
                  <div className="col-md-6">
                    <h2>Preguntas y respuestas</h2>
                    <div className="card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Usuario 1</h5>
                        <p className="card-text">10 de agosto de 2023</p>
                        <p className="card-text">
                          ¿Qué métodos de pago están disponibles?
                        </p>
                        <h6 className="card-subtitle mb-2 text-muted">
                          Respuesta:
                        </h6>
                        <p className="card-text">
                          Aceptamos tarjetas de crédito/débito y PayPal como
                          métodos de pago.
                        </p>
                      </div>
                    </div>
                    <div className="card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Usuario 2</h5>
                        <p className="card-text">15 de agosto de 2023</p>
                        <p className="card-text">
                          ¿Cuánto tarda el envío?
                        </p>
                        <h6 className="card-subtitle mb-2 text-muted">
                          Respuesta:
                        </h6>
                        <p className="card-text">
                          El envío suele tardar de 3 a 5 días hábiles dentro de
                          EE. UU.
                        </p>
                      </div>
                    </div>
                    {/* More questions and answers can be added here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ProductDetail;
