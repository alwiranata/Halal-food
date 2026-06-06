import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
