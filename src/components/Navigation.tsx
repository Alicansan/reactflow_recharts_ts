import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { path: "/", label: "Teams" },
  { path: "/diagram", label: "Diagram" },
  { path: "/charts", label: "Graphics" },
];

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Team Management
        </Link>

        <div className="flex space-x-4">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`rounded px-3 py-2 ${
                location.pathname === path ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
