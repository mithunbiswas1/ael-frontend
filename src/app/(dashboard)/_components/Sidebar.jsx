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
import AelLogo from "@/components/common/AelLogo";
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
  FaComments,
  FaBullhorn,
  FaArchive,
  FaSms,
  FaEnvelopeOpenText,
  FaCreditCard,
  FaReceipt,
  FaFilePdf,
  FaBuilding,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

const ALL_ADMIN_NAV_ITEMS = [
  {
    name: "Admin Dashboard",
    href: "/admin",
    icon: FaTachometerAlt,
    module: "analytics",
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: FaNewspaper,
    module: "blogs",
  },
  {
    name: "Market Updates",
    href: "/admin/market-updates",
    icon: FaChartLine,
    module: "market-updates",
  },

  {
    name: "Safety Guidelines",
    href: "/admin/safety-guidelines",
    icon: FaFilePdf,
    module: "safety_guidelines",
  },
  {
    name: "Courses",
    href: "/admin/courses",
    icon: FaGraduationCap,
    module: "courses",
  },
  {
    name: "Course Enrollments",
    href: "/admin/courses/enrollments",
    icon: FaReceipt,
    module: "courses",
  },
  {
    name: "Certificates",
    href: "/admin/certificates",
    icon: FaAward,
    module: "certificates",
  },
  {
    name: "Subscribers & Transactions",
    href: "/admin/subscriptions",
    icon: FaCreditCard,
    module: "subscriptions",
  },
  {
    name: "Coupons & Vouchers",
    href: "/admin/coupons",
    icon: FaTag,
    module: "subscriptions",
  },
  {
    name: "Advertisements",
    href: "/admin/advertisements",
    icon: FaBullhorn,
    module: "advertisements",
  },
  {
    name: "SMS Campaigns",
    href: "/admin/sms",
    icon: FaSms,
    module: "sms",
  },
  {
    name: "Email Campaigns",
    href: "/admin/email",
    icon: FaEnvelopeOpenText,
    module: "email",
  },
  {
    name: "Newsletter User",
    href: "/admin/newsletter",
    icon: FaNewspaper,
    module: "newsletter",
  },

  {
    name: "User and Role Permission",
    href: "/admin/users",
    icon: FaUserShield,
    module: "users",
  },
  {
    name: "Contact Messages",
    href: "/admin/messages",
    icon: FaEnvelope,
    module: "messages",
  },
  {
    name: "Comments",
    href: "/admin/comments",
    icon: FaComments,
    module: "comments",
  },

  {
    name: "Settings",
    href: "/admin/settings",
    icon: FaCog,
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
    module: "pages_home",
  },
  {
    name: "About Us",
    href: "/admin/pages/about",
    icon: FaInfoCircle,
    module: "pages_about",
  },
  {
    name: "Blog",
    href: "/admin/pages/blogs",
    icon: FaNewspaper,
    module: "pages_blogs",
  },
  {
    name: "Contact Us",
    href: "/admin/pages/contact",
    icon: FaEnvelope,
    module: "pages_contact",
  },
  {
    name: "Safety Guidelines",
    href: "/admin/pages/safety-guidelines",
    icon: FaShieldAlt,
    module: "pages_safety",
  },
  {
    name: "LPG Market Updates",
    href: "/admin/pages/market-updates",
    icon: FaChartLine,
    module: "pages_market",
  },
  {
    name: "Training & Quiz",
    href: "/admin/pages/courses",
    icon: FaGraduationCap,
    module: "pages_courses",
  },
  {
    name: "Related Acts & Rules",
    href: "/admin/pages/acts-and-rules",
    icon: FaBalanceScale,
    module: "pages_acts",
  },
  {
    name: "Terms & Conditions",
    href: "/admin/pages/terms",
    icon: FaFileContract,
    module: "pages_terms",
  },
  {
    name: "Privacy Policy",
    href: "/admin/pages/privacy",
    icon: FaLock,
    module: "pages_privacy",
  },
  {
    name: "FAQ & Help Center",
    href: "/admin/pages/faq",
    icon: FaQuestionCircle,
    module: "pages_faq",
  },
  {
    name: "Subscription & Plans",
    href: "/admin/pages/subscription",
    icon: FaCreditCard,
    module: "pages_subscription",
  },
];

const SUBSCRIBER_NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/user-dashboard",
    icon: FaTachometerAlt,
  },
  {
    name: "Enrolled Courses",
    href: "/user-dashboard/courses",
    icon: FaGraduationCap,
  },
  {
    name: "Subscription",
    href: "/user-dashboard/subscription",
    icon: FaCreditCard,
  },
  {
    name: "My Certificates",
    href: "/user-dashboard/certificates",
    icon: FaAward,
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

  const { data: permData } = useGetMyPermissionsQuery(user?._id, {
    skip: !isLoggedIn || !user?._id,
    refetchOnMountOrArgChange: true,
  });

  const isSuperAdmin =
    user?.role === "super_admin" ||
    (Boolean(permData?.data?.isSuperAdmin) && permData?.data?.role === "super_admin");

  const permissions = permData?.data?.permissions || [];

  const isStaff = [
    "super_admin",
    "admin",
    "instructor",
    "course_admin",
  ].includes(user?.role);

  const isSubscriberOnly = !isStaff;

  const hasPageAccess = (item) => {
    // Under no circumstances should user-dashboard routes be shown to admin or staff in admin navigation
    if (
      item.href?.startsWith("/user-dashboard") ||
      item.href?.startsWith("/subscriber") ||
      item.href?.startsWith("/user/")
    ) {
      return false;
    }
    if (isSuperAdmin) return true;
    if (user?.role === "admin" && (!permissions || permissions.length === 0)) return true;
    if (item.href === "/profile") {
      return true;
    }
    if (item.href === "/admin") {
      return permissions.some((p) => p.actions?.includes("view"));
    }
    const perm = permissions.find(
      (p) =>
        (p.page && p.page === item.href) ||
        (item.module && p.module === item.module)
    );
    return perm ? perm.actions?.includes("view") : false;
  };

  const isInstructor = user?.role === "instructor";

  // Dedicated Instructor navigation: default Courses and Course Enrollments
  const INSTRUCTOR_NAV_ITEMS = [
    {
      name: "Courses",
      href: "/admin/courses",
      icon: FaGraduationCap,
      module: "courses",
    },
    {
      name: "Course Enrollments",
      href: "/admin/courses/enrollments",
      icon: FaReceipt,
      module: "courses",
    },
  ];

  const visibleNavItems = isSubscriberOnly
    ? SUBSCRIBER_NAV_ITEMS
    : isInstructor && (!permissions || permissions.length === 0)
      ? INSTRUCTOR_NAV_ITEMS
      : ALL_ADMIN_NAV_ITEMS.filter((item) => hasPageAccess(item));

  const visiblePagesNavItems = isSubscriberOnly || (isInstructor && (!permissions || permissions.length === 0))
    ? []
    : PAGES_NAV_ITEMS.filter((item) => hasPageAccess(item));

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
    visiblePagesNavItems,
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
  visiblePagesNavItems = PAGES_NAV_ITEMS,
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
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("sidebar_scroll_pos");
    }
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
          <AelLogo
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Site in New Tab"
            className="h-8 sm:h-9 w-auto max-w-[150px]"
            width={140}
            height={36}
          />
        )}
        {isCollapsed && (
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            scroll={false}
            title="Open Site in New Tab"
            className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg hover:opacity-90 transition-opacity"
          >
            A
          </Link>
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
              onError={(e) => {
                e.currentTarget.src = "/default_person.jpg";
              }}
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
            <P className="!text-[11px]">
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
                    ? "bg-primary text-white"
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
        {!isSubscriberOnly && visiblePagesNavItems.length > 0 && (
          <div className="pt-2 border-t border-slate-200">
            {!isCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Pages Content & Configuration
              </div>
            )}
            <ul className="space-y-1">
              {visiblePagesNavItems.map((item) => {
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
                        ? "bg-primary text-white font-bold"
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
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-white bg-rose-50/70 hover:bg-rose-600 border border-rose-200/60 hover:border-rose-600 transition-all duration-200 group cursor-pointer ${isCollapsed ? "justify-center px-2" : ""
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
