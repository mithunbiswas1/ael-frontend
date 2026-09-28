"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { toast } from "sonner";
import { setLogout } from "@/redux/slice/authSlice";
import { P } from "@/components/ui/Typography";
import { useGetMyPermissionsQuery } from "@/redux/api/roleApi";
import {
  FaTachometerAlt,
  FaUser,
  FaNewspaper,
  FaGraduationCap,
  FaQuestionCircle,
  FaAward,
  FaUserShield,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaTimes,
  FaBookOpen,
  FaHome,
  FaInfoCircle,
  FaBalanceScale,
  FaEnvelope,
  FaChartLine,
  FaTag,
  FaLock,
  FaFileContract,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const ALL_ADMIN_NAV_ITEMS = [
  {
    name: "Admin Dashboard",
    href: "/admin",
    icon: FaTachometerAlt,
    module: null,
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: FaNewspaper,
    module: "blogs",
  },
  {
    name: "Courses",
    href: "/admin/courses",
    icon: FaGraduationCap,
    module: "courses",
  },
  {
    name: "Quizzes",
    href: "/admin/quizzes",
    icon: FaQuestionCircle,
    module: "quizzes",
  },
  {
    name: "Certificates",
    href: "/admin/certificates",
    icon: FaAward,
    module: "certificates",
  },
  {
    name: "Roles & Access",
    href: "/admin/roles",
    icon: FaUserShield,
    module: "roles",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: FaUsers,
    module: "users",
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: FaEnvelope,
    module: null,
  },
  {
    name: "Subscriber View",
    href: "/subscriber",
    icon: FaGraduationCap,
    module: null,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: FaUser,
    module: null,
  },
];

const PAGES_NAV_ITEMS = [
  {
    name: "Home",
    href: "/admin/pages/home",
    icon: FaHome,
  },
  {
    name: "About Us",
    href: "/admin/pages/about",
    icon: FaInfoCircle,
  },
  {
    name: "Blog",
    href: "/admin/pages/blogs",
    icon: FaNewspaper,
  },
  {
    name: "Contact Us",
    href: "/admin/pages/contact",
    icon: FaEnvelope,
  },
  {
    name: "Safety Guidelines",
    href: "/admin/pages/safety-guidelines",
    icon: FaShieldAlt,
  },
  {
    name: "LPG Market Updates",
    href: "/admin/pages/market-updates",
    icon: FaChartLine,
  },
  {
    name: "Training & Quiz",
    href: "/admin/pages/courses",
    icon: FaGraduationCap,
  },
  {
    name: "Related Acts & Rules",
    href: "/admin/pages/acts-and-rules",
    icon: FaBalanceScale,
  },
  {
    name: "Terms & Conditions",
    href: "/admin/pages/terms",
    icon: FaFileContract,
  },
  {
    name: "Privacy Policy",
    href: "/admin/pages/privacy",
    icon: FaLock,
  },
  {
    name: "FAQ & Help Center",
    href: "/admin/pages/faq",
    icon: FaQuestionCircle,
  },
];

const SUBSCRIBER_NAV_ITEMS = [
  {
    name: "Learner Hub",
    href: "/subscriber",
    icon: FaTachometerAlt,
  },
  {
    name: "My Courses",
    href: "/subscriber/courses",
    icon: FaGraduationCap,
  },
  {
    name: "My Certificates",
    href: "/subscriber/certificates",
    icon: FaAward,
  },
  {
    name: "Course Catalog",
    href: "/courses",
    icon: FaBookOpen,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: FaUser,
  },
];

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const pathname = usePathname();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const { data: permData } = useGetMyPermissionsQuery(undefined, {
    skip: !isLoggedIn,
  });

  const isSuperAdmin =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    permData?.data?.isSuperAdmin;

  const permissions = permData?.data?.permissions || [];

  const isSubscriberOnly =
    user?.role === "subscriber" || user?.role === "general_user";

  const visibleNavItems = isSubscriberOnly
    ? SUBSCRIBER_NAV_ITEMS
    : ALL_ADMIN_NAV_ITEMS.filter((item) => {
      if (!item.module) return true;
      if (isSuperAdmin) return true;
      const mod = permissions.find((p) => p.module === item.module);
      return mod && mod.actions.includes("view");
    });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubmenu = (id) => {
    setOpenSubmenu((prev) => (prev === id ? null : id));
  };

  const contentProps = {
    isCollapsed,
    toggleCollapse,
    isSubscriberOnly,
    onMobileClose,
    user,
    visibleNavItems,
    pathname,
    openSubmenu,
    toggleSubmenu,
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-200 ease-in-out ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        <SidebarContent {...contentProps} />
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarContent {...contentProps} />
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}
    </>
  );
};

function SidebarContent({
  isCollapsed,
  toggleCollapse,
  isSubscriberOnly,
  onMobileClose,
  user,
  visibleNavItems,
  pathname,
  openSubmenu,
  toggleSubmenu,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const navRef = useRef(null);
  const activeItemRef = useRef(null);

  const handleLogout = () => {
    dispatch(setLogout());
    if (onMobileClose) onMobileClose();
    toast.success("Logged out successfully");
    router.push("/");
  };

  // Restore and persist scroll position across route changes
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const saved = sessionStorage.getItem("sidebar_scroll_pos");
    if (saved !== null) {
      nav.scrollTop = parseInt(saved, 10);
    }

    const onScroll = () => {
      sessionStorage.setItem("sidebar_scroll_pos", String(nav.scrollTop));
    };

    nav.addEventListener("scroll", onScroll, { passive: true });
    return () => nav.removeEventListener("scroll", onScroll);
  }, []);

  // When pathname changes, keep scroll or ensure active item is visible
  useEffect(() => {
    const nav = navRef.current;
    const activeEl = activeItemRef.current;
    if (!nav) return;

    const saved = sessionStorage.getItem("sidebar_scroll_pos");
    if (saved !== null) {
      nav.scrollTop = parseInt(saved, 10);
    } else if (activeEl) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      if (itemRect.bottom > navRect.bottom || itemRect.top < navRect.top) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [pathname]);

  return (
    <>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link
            href={isSubscriberOnly ? "/subscriber" : "/admin"}
            scroll={false}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-black tracking-tight text-primary">
              {isSubscriberOnly ? "AEL Learner" : "AEL Admin"}
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
        )}
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <FaChevronRight className="text-slate-500" />
          ) : (
            <FaChevronLeft className="text-slate-500" />
          )}
        </button>
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Close menu"
          >
            <FaTimes className="w-5 h-5 text-slate-500" />
          </button>
        )}
      </div>

      {/* User Card */}
      <div
        className={`flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 ${isCollapsed ? "justify-center" : ""
          }`}
      >
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary/10 flex-shrink-0 border border-primary/20">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user?.fullName || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm">
              {user?.fullName?.charAt(0) || "U"}
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <P className="text-xs font-bold text-slate-900 truncate">
              {user?.fullName || "Authenticated User"}
            </P>
            <P className="text-[11px] text-primary font-semibold capitalize truncate">
              {user?.role?.replace("_", " ") || "Member"}
            </P>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav ref={navRef} className="flex-1 px-3 py-3 overflow-y-auto space-y-5">
        {/* Core Administrative / Learner Nav */}
        <ul className="space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href} ref={isActive ? activeItemRef : null}>
                <Link
                  href={item.href}
                  scroll={false}
                  onClick={onMobileClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"
                      }`}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* PAGES SECTION (Admin Only) */}
        {!isSubscriberOnly && (
          <div className="pt-2 border-t border-slate-200">
            {!isCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Pages Content & Configuration
              </div>
            )}
            <ul className="space-y-1">
              {PAGES_NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                // Submenu item (Blogs, Contact)
                if (item.submenu) {
                  const isSubmenuOpen =
                    openSubmenu === item.id ||
                    item.submenu.some((sub) => pathname === sub.href);
                  const isAnyActive = item.submenu.some(
                    (sub) => pathname === sub.href
                  );

                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => toggleSubmenu(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${isAnyActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          } ${isCollapsed ? "justify-center" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-3.5 h-3.5 flex-shrink-0 ${isAnyActive ? "text-primary" : "text-slate-400"
                              }`}
                          />
                          {!isCollapsed && <span>{item.name}</span>}
                        </div>
                        {!isCollapsed && (
                          <FaChevronDown
                            className={`w-2.5 h-2.5 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : ""
                              }`}
                          />
                        )}
                      </button>

                      {/* Submenu Dropdown List */}
                      {isSubmenuOpen && !isCollapsed && (
                        <ul className="mt-1 ml-6 pl-2 border-l border-slate-200 space-y-1">
                          {item.submenu.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <li key={sub.href} ref={isSubActive ? activeItemRef : null}>
                                <Link
                                  href={sub.href}
                                  scroll={false}
                                  onClick={onMobileClose}
                                  className={`block px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${isSubActive
                                    ? "bg-primary text-white font-bold"
                                    : "text-slate-600 hover:text-primary hover:bg-slate-50"
                                    }`}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                // Regular Page Item
                const isActive = pathname === item.href;
                return (
                  <li key={item.href} ref={isActive ? activeItemRef : null}>
                    <Link
                      href={item.href}
                      scroll={false}
                      onClick={onMobileClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${isActive
                        ? "bg-primary text-white shadow-xs font-bold"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        } ${isCollapsed ? "justify-center" : ""}`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"
                          }`}
                      />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* Bottom Logout Button */}
      <div className="p-3 border-t border-slate-200">
        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-white bg-rose-50/70 hover:bg-rose-600 border border-rose-200/60 hover:border-rose-600 transition-all duration-200 shadow-2xs group cursor-pointer ${
            isCollapsed ? "justify-center px-2" : ""
          }`}
          title="Logout"
        >
          <FaSignOutAlt className="w-4 h-4 flex-shrink-0 text-rose-500 group-hover:text-white transition-colors" />
          {!isCollapsed && <span className="truncate">Logout</span>}
        </button>
      </div>
    </>
  );
}

export default Sidebar;
