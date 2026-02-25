import { useState, useEffect } from "react";
import apiInstante from "../../utils/axios";
import { useParams } from "react-router-dom";

function PaymentSuccess() {
  const STATUS = {
    verifying: "verificando",
    paid: "pagado",
    alreadyPaid: "ya_pagado",
    unpaid: "no_pagado",
    cancelled: "cancelado",
  };

  const [order, setOrder] = useState([]);
  const [status, setStatus] = useState(STATUS.verifying);

  const param = useParams();

  const urlParam = new URLSearchParams(window.location.search);

  const sessionId = urlParam.get("session_id");

  useEffect(() => {
    apiInstante.get(`checkout/${param.order_oid}`).then((res) => {
      setOrder(res.data);
    });
  }, []);

  useEffect(() => {
    if (!param?.order_oid || !sessionId) return;

    const formdata = new FormData();
    formdata.append("order_oid", param.order_oid);
    formdata.append("session_id", sessionId);

    setStatus(STATUS.verifying);

    apiInstante.post(`payment-success/${param.order_oid}`, formdata).then((res) => {
      if (res.data.message === "Payment Successfully") {
        setStatus(STATUS.paid);
      }
      if (res.data.message === "Already Paid") {
        setStatus(STATUS.alreadyPaid);
      }
      if (res.data.message === "UnPaid") {
        setStatus(STATUS.unpaid);
      }
      if (res.data.message === "Cancelled") {
        setStatus(STATUS.cancelled);
      }
    });
  }, [param?.order_oid, sessionId]);

  return (
    <div>
      <main className="mb-4 mt-4 h-100">
        <div className="container">
          {/* Section: Checkout form */}
          <section className="">
            <div className="gx-lg-5">
              <div className="row pb50">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h4 className="fw-bold text-center mb-4 mt-4">
                      Pago completado{" "}
                      <i className="fas fa-check-circle" />{" "}
                    </h4>
                    {/* <p class="para">Lorem ipsum dolor sit amet, consectetur.</p> */}
                  </div>
                </div>
              </div>
              <div className="row">
                {status === STATUS.verifying && (
                  <div className="col-xl-12">
                    <div className="application_statics">
                      <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="col-lg-12">
                            <div className="border border-3 border-success" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-check-circle text-success"
                                  style={{ fontSize: 100, color: "green" }}
                                />
                              </div>
                              <div className="text-center">
                                <h1>
                                  Verificando pago{" "}
                                  <i className="fas fa-spinner fa-spin"></i>
                                </h1>
                                <p>
                                  <b className="text-success">
                                    Por favor espera mientras verificamos tu
                                    pago.
                                  </b>
                                  <br />
                                  <b className="text-danger">
                                    NOTA: no recargues ni salgas de la página
                                  </b>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {status === STATUS.paid && (
                  <div className="col-xl-12">
                    <div className="application_statics">
                      <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="col-lg-12">
                            <div className="border border-3 border-success" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-check-circle text-success"
                                  style={{ fontSize: 100 }}
                                />
                              </div>
                              <div className="text-center">
                                <h1>Pago realizado correctamente</h1>
                                <p>
                                  Gracias por tu compra. Ya la estamos
                                  procesando.
                                  <br />
                                  Tu número de pedido es <b>#{order.oid}</b>
                                  <br />
                                  Enviamos un correo de confirmación a{" "}
                                  <b>{order.email}</b>
                                </p>
                                <button
                                  className="btn btn-success mt-3"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  Ver pedido <i className="fas fa-eye" />
                                </button>
                                <a
                                  href="/"
                                  className="btn btn-primary mt-3 ms-2"
                                >
                                  Descargar factura{" "}
                                  <i className="fas fa-file-invoice" />
                                </a>
                                <a
                                  href="/"
                                  className="btn btn-secondary mt-3 ms-2"
                                >
                                  Ir al inicio <i className="fas fa-arrow-left" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {status === STATUS.alreadyPaid && (
                  <div className="col-xl-12">
                    <div className="application_statics">
                      <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="col-lg-12">
                            <div className="border border-3 border-info" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-info-circle text-info"
                                  style={{ fontSize: 100 }}
                                />
                              </div>
                              <div className="text-center">
                                <h1>Pedido ya pagado</h1>
                                <p>
                                  Este pedido ya fue completado correctamente.
                                  <br />
                                  No necesitas hacer nada más.
                                </p>
                                <a href="/" className="btn btn-secondary mt-3">
                                  Ir al inicio
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {status === STATUS.unpaid && (
                  <div className="col-xl-12">
                    <div className="application_statics">
                      <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="col-lg-12">
                            <div className="border border-3 border-danger" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-times-circle text-danger"
                                  style={{ fontSize: 100 }}
                                />
                              </div>
                              <div className="text-center">
                                <h1>Pago no completado</h1>
                                <p>
                                  Tu pago no se completó.
                                  <br />
                                  Inténtalo de nuevo para finalizar tu compra.
                                </p>
                                <a
                                  href="/checkout"
                                  className="btn btn-danger mt-3"
                                >
                                  Intentar de nuevo
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {status === STATUS.cancelled && (
                  <div className="col-xl-12">
                    <div className="application_statics">
                      <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="col-lg-12">
                            <div className="border border-3 border-dark" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-ban text-dark"
                                  style={{ fontSize: 100 }}
                                />
                              </div>
                              <div className="text-center">
                                <h1>Pago cancelado</h1>
                                <p>
                                  Cancelaste el proceso de pago.
                                  <br />
                                  Puedes volver a pagar cuando quieras.
                                </p>
                                <a
                                  href="/checkout"
                                  className="btn btn-dark mt-3"
                                >
                                  Volver a pagar
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Resumen del pedido
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              />
            </div>
            <div className="modal-body">
              <div className="modal-body text-start text-black p-4">
                <h5
                  className="modal-title text-uppercase "
                  id="exampleModalLabel"
                >
                  {order.full_name}
                </h5>
                <h6>{order.email}</h6>
                <h6>{order.mobile}</h6>
                <h6 className="mb-5">
                  {order.address} - {order.city} - {order.state} -{" "}
                  {order.country}
                </h6>
                <p className="mb-0" style={{ color: "#35558a" }}>
                  Resumen de pago
                </p>
                <hr
                  className="mt-2 mb-4"
                  style={{
                    height: 0,
                    backgroundColor: "transparent",
                    opacity: ".75",
                    borderTop: "2px dashed #9e9e9e",
                  }}
                />

                {order.orderitem?.map((o, index) => (
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold mb-0">{o.product?.title}</p>
                    <p className="text-muted mb-0">${o.price}</p>
                  </div>
                ))}

                <div className="d-flex justify-content-between">
                  <p className="small mb-0">Subtotal</p>
                  <p className="small mb-0">${order.sub_total}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="small mb-0">Costo de envío</p>
                  <p className="small mb-0">${order.shipping_amount}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="small mb-0">Tarifa de servicio</p>
                  <p className="small mb-0">${order.service_fee}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="small mb-0">Impuestos</p>
                  <p className="small mb-0">${order.tax_fee}</p>
                </div>
                {order?.saved && (
                  <div className="d-flex justify-content-between">
                    <p className="small mb-0">Descuento</p>
                    <p className="small mb-0">-${order.saved}</p>
                  </div>
                )}
                <div className="d-flex justify-content-between mt-4">
                  <p className="fw-bold">Total</p>
                  <p className="fw-bold" style={{ color: "#35558a" }}>
                    ${order.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
