import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import dayjs from "dayjs";
import "dayjs/locale/es";
import moment from "moment";
import "moment/locale/es";

dayjs.locale("es");
moment.locale("es");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
