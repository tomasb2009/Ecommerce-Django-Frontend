import React from "react";
import Sidebar from "./Sidebar";

/**
 * Layout base para todas las pantallas del vendor.
 * Replica la estructura del dashboard: sidebar negro pegado a la izquierda
 * y contenido a la derecha sin márgenes extra.
 */
function VendorLayout({ children }) {
  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">{children}</div>
      </div>
    </div>
  );
}

export default VendorLayout;

