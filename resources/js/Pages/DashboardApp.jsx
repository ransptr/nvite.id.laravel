import {lazy, Suspense} from 'react';
import {BrowserRouter, Navigate, Route, Routes, useParams} from 'react-router-dom';
import {useAuth} from '@/hooks/useAuth';

const DashboardPage = lazy(() => import('./Dashboard').then((m) => ({default: m.DashboardPage})));
const InvitationBuilderPage = lazy(() => import('./InvitationBuilder').then((m) => ({default: m.InvitationBuilderPage})));
const InvitationPreviewFramePage = lazy(() => import('./InvitationPreview').then((m) => ({default: m.InvitationPreviewFramePage})));
const NewInvitationPage = lazy(() => import('./NewInvitation').then((m) => ({default: m.NewInvitationPage})));
const ProfilePage = lazy(() => import('./Profile').then((m) => ({default: m.ProfilePage})));
const PlanSelectionPage = lazy(() => import('./PlanSelection').then((m) => ({default: m.PlanSelectionPage})));
const InvitationExportPdfPage = lazy(() => import('./InvitationExportPdf').then((m) => ({default: m.InvitationExportPdfPage})));
const RsvpManager = lazy(() => import('./RsvpManager'));
const GuestManager = lazy(() => import('./GuestManager'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8b181] border-t-transparent" />
    </div>
  );
}

function ProtectedRoute({children}) {
  const {session, loading} = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9974a] border-t-transparent" />
      </div>
    );
  }
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function BuilderRoute() {
  const {id} = useParams();
  return <InvitationBuilderPage id={id} />;
}

export default function DashboardApp() {
  return (
    <BrowserRouter basename="/dashboard">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/new" element={<ProtectedRoute><NewInvitationPage /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><InvitationBuilderPage /></ProtectedRoute>} />
          <Route path="/:id" element={<ProtectedRoute><BuilderRoute /></ProtectedRoute>} />
          <Route path="/preview" element={<ProtectedRoute><InvitationPreviewFramePage /></ProtectedRoute>} />
          <Route path="/export-pdf" element={<ProtectedRoute><InvitationExportPdfPage /></ProtectedRoute>} />
          <Route path="/:id/rsvps" element={<ProtectedRoute><RsvpManager /></ProtectedRoute>} />
          <Route path="/:id/guests" element={<ProtectedRoute><GuestManager /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/plans" element={<ProtectedRoute><PlanSelectionPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
