import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Loading } from "./components/Loading";
import { CommandPalette } from "./components/CommandPalette";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";

// Lazy-loaded pages
const Dashboard  = lazy(() => import("./pages/Dashboard").then(m  => ({ default: m.Dashboard  })));
const Analytics  = lazy(() => import("./pages/Analytics").then(m  => ({ default: m.Analytics  })));
const UsersPage  = lazy(() => import("./pages/Users").then(m      => ({ default: m.UsersPage  })));
const Devices    = lazy(() => import("./pages/Devices").then(m    => ({ default: m.Devices    })));
const Settings   = lazy(() => import("./pages/Settings").then(m   => ({ default: m.Settings   })));
const Payments   = lazy(() => import("./pages/Payments").then(m   => ({ default: m.Payments   })));
const Security   = lazy(() => import("./pages/Security").then(m   => ({ default: m.Security   })));
const Broadcasts = lazy(() => import("./pages/Broadcasts").then(m => ({ default: m.Broadcasts })));

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <HeroUIProvider>
          <BrowserRouter>
            <CommandPalette />
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />

              {/* Protected — all dashboard routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/"           element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>}  />
                <Route path="/analytics"  element={<Suspense fallback={<Loading />}><Analytics /></Suspense>}  />
                <Route path="/users"      element={<Suspense fallback={<Loading />}><UsersPage /></Suspense>}  />
                <Route path="/devices"    element={<Suspense fallback={<Loading />}><Devices /></Suspense>}    />
                <Route path="/broadcasts" element={<Suspense fallback={<Loading />}><Broadcasts /></Suspense>} />
                <Route path="/payments"   element={<Suspense fallback={<Loading />}><Payments /></Suspense>}   />
                <Route path="/security"   element={<Suspense fallback={<Loading />}><Security /></Suspense>}   />
                <Route path="/settings"   element={<Suspense fallback={<Loading />}><Settings /></Suspense>}   />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </HeroUIProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
