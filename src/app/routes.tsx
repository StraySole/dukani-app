import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { Products } from "./components/Products";
import { AddProduct } from "./components/AddProduct";
import { QuickSale } from "./components/QuickSale";
import { Debts } from "./components/Debts";
import { CustomerDetail } from "./components/CustomerDetail";
import { Reports } from "./components/Reports";
import { Subscription } from "./components/Subscription";
import { Settings } from "./components/Settings";
import { Success } from "./components/Success";

export const router = createBrowserRouter([
  { path: "/", Component: Login },
  { path: "/home", Component: Home },
  { path: "/products", Component: Products },
  { path: "/add-product", Component: AddProduct },
  { path: "/quick-sale", Component: QuickSale },
  { path: "/debts", Component: Debts },
  { path: "/customer/:id", Component: CustomerDetail },
  { path: "/reports", Component: Reports },
  { path: "/subscription", Component: Subscription },
  { path: "/settings", Component: Settings },
  { path: "/success", Component: Success },
]);
