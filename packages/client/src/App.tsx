import { Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TemplatesPage from "./pages/TemplatesPage";
import FormBuilder from "./pages/FormBuilder";
import FormFiller from "./pages/FormFiller";
import FormResponses from "./pages/FormResponses";

function App() {
  const location = useLocation();

  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `text-sm font-medium px-3 py-2 rounded-md transition-colors ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-xl font-semibold text-gray-900">
                Google Forms Clone
              </Link>
              <div className="flex items-center space-x-2">
                <Link to="/" className={navLinkClass("/")}>
                  Submissions
                </Link>
                <Link to="/templates" className={navLinkClass("/templates")}>
                  Templates
                </Link>
              </div>
            </div>

          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/forms/new" element={<FormBuilder />} />
          <Route path="/forms/:id/fill" element={<FormFiller />} />
          <Route path="/forms/:id/responses" element={<FormResponses />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
