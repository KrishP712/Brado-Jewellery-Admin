import React, { useState } from "react";
import { Menu, Bell, Search, ChevronDown, Globe, Sun, Moon } from "lucide-react";
import { useDispatch } from "react-redux";
import { adminlogout } from "../../../Redux/slice/adminauth";

const Header = ({ setIsMobileOpen }) => {
  const dispatch = useDispatch()
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const handleLogout = async () => {
    try {
      await dispatch(adminlogout()).unwrap();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo / Title */}
          <h1 className="text-lg font-bold text-gray-800 tracking-wide">
            Brado Jewellery
          </h1>

          {/* Date */}
          <span className="hidden md:block text-sm text-gray-500 ml-2">
            {today}
          </span>

          {/* Desktop Search */}
          <div className="hidden md:block relative ml-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden md:block text-sm">EN</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">EN</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">FR</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">HI</button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-sm font-semibold text-gray-900">
                A
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                Admin
              </span>
              <ChevronDown className="hidden md:block h-4 w-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
