import { Outlet } from "@tanstack/react-router";
import Navbar from "../Navbar";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <div className="px-5 py-3">
        <Outlet />
      </div>
    </div>
  );
}
