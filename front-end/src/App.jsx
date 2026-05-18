import { Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./lib/auth";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import DigitalPortfolio from "./pages/DigitalPortfolio";
import DigitalProjectDetail from "./pages/DigitalProjectDetail";
import Foto from "./pages/Foto";
import Video from "./pages/Video";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/workspace/Dashboard";

import Projects from "./pages/workspace/projects/Index";
import CreateProject from "./pages/workspace/projects/Create";
import EditProject from "./pages/workspace/projects/Edit";

import Media from "./pages/workspace/Media";
import Analytics from "./pages/workspace/Analytics";

function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      <Route
        path="/portfolio"
        element={
          <PublicLayout>
            <Portfolio />
          </PublicLayout>
        }
      />

      <Route
        path="/portfolio/digital"
        element={
          <PublicLayout>
            <DigitalPortfolio />
          </PublicLayout>
        }
      />

      <Route
        path="/portfolio/digital/:slug"
        element={
          <PublicLayout>
            <DigitalProjectDetail />
          </PublicLayout>
        }
      />

      <Route
        path="/portfolio/foto"
        element={
          <PublicLayout>
            <Foto />
          </PublicLayout>
        }
      />

      <Route
        path="/portfolio/video"
        element={
          <PublicLayout>
            <Video />
          </PublicLayout>
        }
      />

      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />

      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/create"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateProject />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id/edit"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EditProject />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/media"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Media />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}