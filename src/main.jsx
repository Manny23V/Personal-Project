import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CommunitiesPage from "./pages/CommunitiesPage.jsx";
import CommunityDetailPage from "./pages/CommunityDetailPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import AnimeDetailPage from "./components/AnimeDetailPage.jsx";
import MangaDetailPage from "./components/MangaDetailPage.jsx";
import ChatPage from './pages/ChatPage.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/communities/:commId" element={<CommunityDetailPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/anime/:id" element={<AnimeDetailPage />} />
        <Route path="/manga/:id" element={<MangaDetailPage />} />
        <Route path="/chat/:username" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
