import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { MotionConfig } from "framer-motion";
import RootLayout from "@/components/layout/RootLayout";
import HomePage from "@/pages/HomePage";

const FacultiesPage = lazy(() => import("@/pages/FacultiesPage"));
const CabinetPage = lazy(() => import("@/pages/CabinetPage"));
const RankingPage = lazy(() => import("@/pages/RankingPage"));
const GuestbookPage = lazy(() => import("@/pages/GuestbookPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function App() {
  return (
    // Respect the OS "reduce motion" setting for all framer-motion animations
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="fakultas" element={<FacultiesPage />} />
            <Route path="kabinet" element={<CabinetPage />} />
            <Route path="ranking" element={<RankingPage />} />
            <Route path="guestbook" element={<GuestbookPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}
