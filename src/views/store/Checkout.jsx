import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import apiInstante from "../../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SERVER_URL } from "../../utils/constants";

const initialOptions = {
  clientId: "test",
  currency: "USD",
  intent: "capture",
};

function Checkout() {
  const [order, setOrder] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const param = useParams();

  const fetchOrderData = () => {
    apiInstante.get(`checkout/${param.order_oid}/`).then((res) => {
      setOrder(res.data);
    });
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Por favor, ingresa un código de cupón",
      });
      return;
    }

    if (!order?.oid) {
      Swal.fire({
        icon: "error",
        title: "Pedido no encontrado",
      });
      return;
    }

    const formdata = new FormData();
    formdata.append("order_oid", order.oid);
    formdata.append("coupon_code", couponCode.trim());

    try {
      const response = await apiInstante.post("coupon/", formdata);

      fetchOrderData();
      setCouponCode(""); // Limpiar el campo después de aplicar

      Swal.fire({
        icon: response.data.icon || "success",
        title: response.data.message || "Cupón aplicado",
      });
    } catch (error) {
      console.error("Error applying coupon:", error);
      const errorMessage = error?.response?.data?.message 
        || error?.response?.data?.detail 
        || "No se pudo aplicar el cupón";
      
      Swal.fire({
        icon: "error",
        title: errorMessage,
      });
    }
  };

  const payWithStripe = (e) => {
    setPaymentLoading(true);
    e.target.form.submit();
  };

  return (
    <div>
      <main>
        <main className="mb-4 mt-4">
          <div className="container">
            <section className="">
              <div className="row gx-lg-5">
                <div className="col-lg-8 mb-4 mb-md-0">
                  <section className="">
                    <div className="alert alert-warning">
                      <strong>Revisa tu envío y los detalles del pedido </strong>
                    </div>
                    <form>
                      <h5 className="mb-4 mt-4">Dirección de envío</h5>
                      <div className="row mb-4">
                        <div className="col-lg-12">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Nombre completo
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={order.full_name}
                              className="form-control"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Correo electrónico
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.email}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Teléfono
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={order.mobile}
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Dirección
                            </label>
                            <input
                              value={order.address}
                              type="text"
                              readOnly
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Ciudad
                            </label>
                            <input
                              value={order.city}
                              type="text"
                              readOnly
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Estado/Provincia
                            </label>
                            <input
                              value={order.state}
                              type="text"
                              readOnly
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              País
                            </label>
                            <input
                              value={order.country}
                              type="text"
                              readOnly
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <h5 className="mb-4 mt-4">Dirección de facturación</h5>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          defaultValue=""
                          id="form6Example8"
                          defaultChecked=""
                        />
                        <label
                          className="form-check-label"
                          htmlFor="form6Example8"
                        >
                          Igual que la dirección de envío
                        </label>
                      </div>
                    </form>
                  </section>
                  {/* Section: Biling details */}
                </div>
                <div className="col-lg-4 mb-4 mb-md-0">
                  {/* Section: Summary */}
                  <section className="shadow-4 p-4 rounded-5 mb-4">
                    <h5 className="mb-3">Resumen del carrito</h5>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Subtotal </span>
                      <span>${order.sub_total}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Envío </span>
                      <span>${order.shipping_amount}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Impuestos </span>
                      <span>${order.tax_fee}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Tarifa de servicio </span>
                      <span>${order.service_fee}</span>
                    </div>

                    {order.saved !== "0.00" && (
                      <div className="d-flex text-danger fw-bold justify-content-between">
                        <span>Descuento</span>
                        <span>-${order.saved}</span>
                      </div>
                    )}

                    <hr className="my-4" />
                    <div className="d-flex justify-content-between fw-bold mb-5">
                      <span>Total </span>
                      <span>${order.total}</span>
                    </div>

                    <div className="shadow p-3 d-flex mt-4 mb-4">
                      <input
                        value={couponCode}
                        name="couponCode"
                        type="text"
                        className="form-control"
                        style={{ border: "dashed 1px gray" }}
                        placeholder="Ingresa tu código de cupón"
                        onChange={(e) => setCouponCode(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            applyCoupon();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        className="btn btn-success ms-1"
                      >
                        <i className="fas fa-check-circle"></i> Aplicar
                      </button>
                    </div>

                    {paymentLoading === true && (
                      <form
                        action={`${SERVER_URL}/api/v1/stripe-checkout/${order?.oid}/`}
                        method="POST"
                      >
                        <button
                          type="submit"
                          disabled
                          className="btn btn-primary btn-rounded w-100 mt-2"
                          style={{ backgroundColor: "#635BFF" }}
                          onClick={payWithStripe}
                        >
                          Procesando… (Stripe){" "}
                          <i className=" fas fa-spinner fa-spin"></i>
                        </button>
                      </form>
                    )}
                    {paymentLoading === false && (
                      <form
                        action={`${SERVER_URL}/api/v1/stripe-checkout/${order?.oid}`}
                        method="POST"
                      >
                        <button
                          type="submit"
                          className="btn btn-primary btn-rounded w-100 mt-2"
                          style={{ backgroundColor: "#635BFF" }}
                          onClick={payWithStripe}
                        >
                          Pagar ahora (Stripe)
                          <i className=" fas fa-credit-card"></i>
                        </button>
                      </form>
                    )}

                    <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons
                        className="mt-3"
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD",
                                  value: 100,
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            const name = details.payer.name.given_name;
                            const status = details.status;
                            const payapl_order_id = data.orderID;

                            console.log(status);
                            if (status === "COMPLETED") {
                              navigate(
                                `/payment-success/${order.oid}/?payapl_order_id=${payapl_order_id}`,
                              );
                            }
                          });
                        }}
                      />
                    </PayPalScriptProvider>

                    {/* <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Flutterwave)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paystack)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paypal)</button> */}
                  </section>
                </div>
              </div>
            </section>
          </div>
        </main>
      </main>
    </div>
  );
}

export default Checkout;
