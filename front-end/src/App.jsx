import { lazy, Suspense } from "react";
const PublicLayout = lazy(() => import("./layouts/PublicLayout"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const Home = lazy(() => import("./pages/Home"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const DigitalPortfolio = lazy(() => import("./pages/DigitalPortfolio"));
const DigitalProjectDetail = lazy(() => import("./pages/DigitalProjectDetail"));
const ProjectCategories = lazy(() => import("./pages/workspace/projects/Categories"));
const Foto = lazy(() => import("./pages/Foto"));
const PhotoAlbumDetail = lazy(() => import("./pages/PhotoAlbumDetail"));
const Video = lazy(() => import("./pages/Video"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/auth/Login"));
const Dashboard = lazy(() => import("./pages/workspace/Dashboard"));
const Projects = lazy(() => import("./pages/workspace/projects/Index"));
const CreateProject = lazy(() => import("./pages/workspace/projects/Create"));
const EditProject = lazy(() => import("./pages/workspace/projects/Edit"));
const Media = lazy(() => import("./pages/workspace/Media"));
const Analytics = lazy(() => import("./pages/workspace/Analytics"));

import ScrollToTop from "./components/ScrollToTop";
import { Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./lib/auth";

























function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-sm text-gray-400">
            Loading page...
          </div>
        }
      >
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
        path="/portfolio/foto/:slug"
        element={
          <PublicLayout>
            <PhotoAlbumDetail />
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
              <ProjectCategories />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      {["web", "foto", "video"].map((type) => (
        <Route
          key={type}
          path={`/projects/${type}`}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Projects />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      ))}

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
      </Suspense>
    </>
  );
}