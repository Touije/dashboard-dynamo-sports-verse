
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Trophy, Shield, Calendar } from "lucide-react";

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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Sports Dashboard</h1>
          <p className="text-gray-500 text-sm">Gestion des données sportives</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            href="/"
            icon={FileText}
            label="Articles"
            isActive={currentPath === "/" || currentPath.startsWith("/articles")}
          />
          <NavItem
            href="/clubs"
            icon={Shield}
            label="Clubs"
            isActive={currentPath.startsWith("/clubs")}
          />
          <NavItem
            href="/competitions"
            icon={Trophy}
            label="Compétitions"
            isActive={currentPath.startsWith("/competitions")}
          />
          <NavItem
            href="/matches"
            icon={Calendar}
            label="Matches"
            isActive={currentPath.startsWith("/matches")}
          />
        </nav>
        <div className="p-4 border-t border-gray-200">
          <p className="text-gray-500 text-sm">© 2025 Sports Dashboard</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
