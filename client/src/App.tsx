import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // Import the UserProvider
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";

export const BASE_URL = "http://localhost:5000/api";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/:username/edit" element={<EditProfilePage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
