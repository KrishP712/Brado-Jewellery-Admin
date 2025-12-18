import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Gem,
  FileText,
  Filter,
  ShoppingBasket,
  TicketPercent,
  MessageSquareQuote,
  GalleryVerticalEnd,
  Tag,
} from "lucide-react";

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/products", label: "Products", icon: Gem },
    { path: "/orders", label: "Orders", icon: ShoppingCart },
    { path: "/customers", label: "Customers", icon: Users },
    { path: "/category", label: "Category", icon: ShoppingBasket },
    { path: "/filter", label: "Filter", icon: Filter },
    { path: "/coupon", label: "Coupon", icon: TicketPercent },
    { path: "/testimonial", label: "Testimonial", icon: MessageSquareQuote },
    { path: "/carousel", label: "Carousel", icon: GalleryVerticalEnd  },
    { path: "/offer", label: "Offer", icon: Tag  },
    { path: "/inventory", label: "Inventory", icon: Package },
    { path: "/media", label: "Media", icon: BarChart3 },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-r border-amber-900/20
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-900/30 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Gem className="h-8 w-8 text-amber-400" />
              <div className="absolute inset-0 blur-md bg-amber-400/30"></div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                BRADO
              </span>
              <p className="text-[10px] text-amber-200/60 tracking-widest uppercase">Jewellery</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-amber-400 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex flex-col gap-1.5 overflow-y-auto h-[calc(100vh-120px)] pb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden
                  ${isActive
                    ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 shadow-lg shadow-amber-900/20 border border-amber-500/30"
                    : "hover:bg-slate-700/50 text-gray-300 hover:text-amber-300 hover:border-amber-500/20 border border-transparent"
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600"></div>
                )}
                <Icon className={`h-5 w-5 transition-all duration-200 ${isActive ? 'text-amber-400' : 'text-gray-400 group-hover:text-amber-400'}`} />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <div className="absolute right-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;