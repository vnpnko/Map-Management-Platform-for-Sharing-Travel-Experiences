import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import { Layout } from "./pages/Layout/Layout.tsx";
import SearchPage from "./pages/SearchPage.tsx";

export const BASE_URL = "http://localhost:5000/api";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:username" element={<ProfilePage />} />
            <Route path="/:username/edit" element={<EditProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
