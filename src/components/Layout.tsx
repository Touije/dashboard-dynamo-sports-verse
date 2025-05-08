
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Trophy, Shield, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon: Icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-md transition-colors",
        isActive
          ? "bg-primary text-white"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

// Mobile navigation item component
const MobileNavItem = ({ href, icon: Icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex flex-col items-center justify-center px-2 py-2 transition-colors",
        isActive
          ? "text-primary"
          : "text-gray-500 hover:text-gray-900"
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();

  const navItems = [
    {
      href: "/",
      icon: FileText,
      label: "Articles",
      isActive: currentPath === "/" || currentPath.startsWith("/articles"),
    },
    {
      href: "/clubs",
      icon: Shield,
      label: "Clubs",
      isActive: currentPath.startsWith("/clubs"),
    },
    {
      href: "/competitions",
      icon: Trophy,
      label: "Compétitions",
      isActive: currentPath.startsWith("/competitions"),
    },
    {
      href: "/matches",
      icon: Calendar,
      label: "Matches",
      isActive: currentPath.startsWith("/matches"),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
      {/* Desktop Sidebar - hidden on mobile */}
      {!isMobile && (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            {/* Logo and title */}
            <div className="flex flex-col items-center">
              <img 
                src="/lovable-uploads/10f730c5-88e8-4306-8411-99ed7ed2cf8f.png" 
                alt="DRIBA Logo" 
                className="h-16 w-auto mb-2"
              />
              <p className="text-gray-500 text-sm text-center">Les dernières infos et analyses du monde du football Marocain</p>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={item.isActive}
              />
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <p className="text-gray-500 text-sm">© 2025 DRIBA</p>
          </div>
        </aside>
      )}

      {/* Mobile Header - only shown on mobile */}
      {isMobile && (
        <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="flex flex-col items-center">
            <img 
              src="/lovable-uploads/10f730c5-88e8-4306-8411-99ed7ed2cf8f.png" 
              alt="DRIBA Logo" 
              className="h-12 w-auto mb-1"
            />
            <p className="text-gray-500 text-xs text-center">Les dernières infos et analyses du monde du football Marocain</p>
          </div>
        </header>
      )}

      {/* Main Content - adjusted for mobile layout */}
      <main className={cn(
        "flex-1 overflow-y-auto",
        isMobile ? "pb-20 p-4 pt-2" : "p-8"
      )}>
        {children}
      </main>

      {/* Mobile Bottom Navigation - shown only on mobile */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-10">
          {navItems.map((item) => (
            <MobileNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
            />
          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;
