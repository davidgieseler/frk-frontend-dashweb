import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import NotFoundPage from "../pages/NotFoundPage";
import Login from "../pages/Login";

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-[var(--background-color)] text-[var(--text-color)]">
    <Navbar />
    <main className="flex-grow flex items-center justify-center">
      <Outlet />
    </main>
  </div>
);

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
