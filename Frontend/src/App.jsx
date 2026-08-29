import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import SettingsLayout from "./layouts/SettingsLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyNotice from "./pages/auth/VerifyNotice";

import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import ProjectOverview from "./pages/projects/ProjectOverview";
import Tasks from "./pages/tasks/Tasks";
import TaskDetail from "./pages/tasks/TaskDetail";
import Notes from "./pages/notes/Notes";
import Members from "./pages/members/Members";
import ProjectWorkspace from "./components/workspace/ProjectWorkspace";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/settings/Profile";
import Health from "./pages/admin/Health";

function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 text-center px-4">
      <h1 className="text-6xl font-extrabold text-slate-900">404</h1>
      <p className="text-sm text-slate-400">The page you're looking for doesn't exist.</p>
      <a href="/dashboard" className="text-sm font-bold text-slate-900 underline underline-offset-2">
        Back to dashboard
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/verify-email/:verificationToken" element={<VerifyEmail />} />
        <Route path="/verify-notice" element={<VerifyNotice />} />
      </Route>

      {}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectOverview />} />
          <Route path="/projects/:projectId/tasks" element={<Tasks />} />
          <Route path="/projects/:projectId/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/projects/:projectId/notes" element={<Notes />} />
          <Route path="/projects/:projectId/members" element={<Members />} />
          <Route path="/projects/:projectId/console" element={<ProjectWorkspace />} />

          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/health" element={<Health />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
