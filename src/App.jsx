import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import Logout from "./views/auth/Logout";
import ForgotPassword from "./views/auth/ForgotPassword";
import CreatePassword from "./views/auth/CreatePassword";
import StoreHeader from "./views/base/StoreHeader";
import StoreFooter from "./views/base/StoreFooter";
import MainWrapper from "./layout/MainWrapper";
import Products from "./views/store/Products";
import ProductDetail from "./views/store/ProductDetail";
import Cart from "./views/store/Cart";
import Checkout from "./views/store/Checkout";
import PaymentSuccess from "./views/store/PaymentSuccess";
import Search from "./views/store/Search";
import { CartContext } from "./views/plugins/Context";
import { useEffect, useState } from "react";
import CartID from "./views/plugins/CartID";
import UserData from "./views/plugins/UserData";
import apiInstante from "./utils/axios";
import Account from "./views/customer/Account";
import PrivateRoute from "./layout/PrivateRoute";
import Orders from "./views/customer/Orders";
import OrderDetail from "./views/customer/OrderDetail";
import Wishlist from "./views/customer/Wishlist";
import CustomerNotification from "./views/customer/CustomerNotification";
import CustomerSettings from "./views/customer/CustomerSettings";
import Invoce from "./views/customer/Invoice";
import Dashboard from "./views/vendor/Dashboard";
import VendorProducts from "./views/vendor/Products";
import VendorProductCreate from "./views/vendor/ProductCreate";
import VendorProductUpdate from "./views/vendor/ProductUpdate";
import VendorOrders from "./views/vendor/Orders";
import VendorOrderDetail from "./views/vendor/OrderDetail";
import VendorEarning from "./views/vendor/Earning";
import VendorReviews from "./views/vendor/Reviews";
import VendorCoupon from "./views/vendor/Coupon";
import VendorCouponCreate from "./views/vendor/CouponCreate";
import VendorCouponUpdate from "./views/vendor/CouponUpdate";
import VendorNotifications from "./views/vendor/Notifications";
import VendorSettings from "./views/vendor/Settings";
import VendorShop from "./views/vendor/Shop";
import VendorShopUpdate from "./views/vendor/ShopUpdate";

function totalCartItems(cartList) {
  if (!Array.isArray(cartList)) return 0;
  return cartList.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  const cart_id = CartID();
  const userData = UserData();

  useEffect(() => {
    if (cart_id == null || cart_id === undefined) {
      setCartCount(0);
      return;
    }
    const url = userData?.user_id
      ? `cart-list/${cart_id}/${userData.user_id}/`
      : `cart-list/${cart_id}/`;
    apiInstante
      .get(url)
      .then((res) => setCartCount(totalCartItems(res.data)))
      .catch(() => setCartCount(0));
  }, [cart_id, userData?.user_id]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      <BrowserRouter>
        <MainWrapper>
          <StoreHeader />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-new-password" element={<CreatePassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Store Components */}
            <Route path="/" element={<Products />} />
            <Route path="/detail/:slug/" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/:order_oid/" element={<Checkout />} />
            <Route
              path="/payment-success/:order_oid/"
              element={<PaymentSuccess />}
            />
            <Route path="/search" element={<Search />} />

            {/* Customer Routes */}

            <Route
              path="/customer/account/"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/orders/"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/orders/:order_oid/"
              element={
                <PrivateRoute>
                  <OrderDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/wishlist/"
              element={
                <PrivateRoute>
                  <Wishlist />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/notifications/"
              element={
                <PrivateRoute>
                  <CustomerNotification />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/settings/"
              element={
                <PrivateRoute>
                  <CustomerSettings />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/invoice/:order_oid/"
              element={
                <PrivateRoute>
                  <Invoce />
                </PrivateRoute>
              }
            />

            {/* Vendor Routes */}
            <Route
              path="/vendor/dashboard/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/shop/"
              element={
                <PrivateRoute>
                  <VendorShop />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/shop/update/"
              element={
                <PrivateRoute>
                  <VendorShopUpdate />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/products/"
              element={
                <PrivateRoute>
                  <VendorProducts />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/product/new/"
              element={
                <PrivateRoute>
                  <VendorProductCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/product/:product_id/edit/"
              element={
                <PrivateRoute>
                  <VendorProductUpdate />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/orders/"
              element={
                <PrivateRoute>
                  <VendorOrders />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/orders/:order_oid/"
              element={
                <PrivateRoute>
                  <VendorOrderDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/earning/"
              element={
                <PrivateRoute>
                  <VendorEarning />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/reviews/"
              element={
                <PrivateRoute>
                  <VendorReviews />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/coupon/"
              element={
                <PrivateRoute>
                  <VendorCoupon />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/coupon/new/"
              element={
                <PrivateRoute>
                  <VendorCouponCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/coupon/:coupon_id/edit/"
              element={
                <PrivateRoute>
                  <VendorCouponUpdate />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/notifications/"
              element={
                <PrivateRoute>
                  <VendorNotifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor/settings/"
              element={
                <PrivateRoute>
                  <VendorSettings />
                </PrivateRoute>
              }
            />
          </Routes>

          <StoreFooter />
        </MainWrapper>
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;
