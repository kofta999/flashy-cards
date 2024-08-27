import { Outlet } from "@tanstack/react-router";

export default function DecksLayout() {
  return (
    <div className="border rounded p-5 md:w-1/2 lg:w-1/3 md:mx-auto mx-5 h-[75dvh]">
      <Outlet />
    </div>
  );
}
