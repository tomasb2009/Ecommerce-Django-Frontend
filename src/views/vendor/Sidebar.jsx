import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `nav-link text-white${isActive ? " active" : ""}`;

  return (
    <div
      className="col-md-3 col-lg-2 sidebar-offcanvas bg-dark navbar-dark"
      id="sidebar"
      role="navigation"
    >
      <ul className="nav nav-pills flex-column mb-auto nav flex-column pl-1 pt-2">
        <li className="mb-3">
          <NavLink to="/vendor/dashboard/" className={linkClass} end>
            <i className="bi bi-speedometer" /> Dashboard
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink to="/vendor/shop/" className={linkClass}>
            <i className="bi bi-shop" /> Shop
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink to="/vendor/products/" className={linkClass}>
            <i className="bi bi-grid" /> Products
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink to="/vendor/orders/" className={linkClass}>
            <i className="bi bi-cart-check" /> Orders
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink to="/vendor/earning/" className={linkClass}>
            <i className="bi bi-currency-dollar" /> Earning
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink to="/vendor/reviews/" className={linkClass}>
            <i className="bi bi-star" /> Reviews
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink to="/vendor/product/new/" className={linkClass}>
            <i className="bi bi-plus-circle" /> Add Product
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink to="/vendor/coupon/" className={linkClass}>
            <i className="bi bi-tag" /> Coupon &amp; Discount
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink to="/vendor/notifications/" className={linkClass}>
            <i className="bi bi-bell" /> Notifications
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink to="/vendor/settings/" className={linkClass}>
            <i className="bi bi-gear-fill" /> Settings
          </NavLink>
        </li>

        <li className="mb-3">
          <NavLink to="/logout" className={linkClass}>
            <i className="bi bi-box-arrow-left" /> Logout
          </NavLink>
        </li>
      </ul>
      <hr />
    </div>
  );
}

export default Sidebar;
