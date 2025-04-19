import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DraftMapProvider } from "./context/DraftMapContext";
import GoogleMapsLoader from "./common/components/GoogleMapsLoader.tsx";

import { Layout } from "./common/components/layout/Layout";
import SignUpPage from "./pages/SignUp/SignUpPage.tsx";
import LogInPage from "./pages/LogIn/LogInPage.tsx";
import ProfilePage from "./pages/Profile/ProfilePage.tsx";
import EditProfilePage from "./pages/EditProfile/EditProfilePage.tsx";
import CreatePage from "./pages/Create/CreatePage";
import ExplorePage from "./pages/Explore/ExplorePage.tsx";

export const BASE_URL = "http://localhost:5000/api";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/search"
            element={
              <GoogleMapsLoader>
                <ExplorePage />
              </GoogleMapsLoader>
            }
          />
          <Route
            path="/create"
            element={
              <DraftMapProvider>
                <GoogleMapsLoader>
                  <CreatePage />
                </GoogleMapsLoader>
              </DraftMapProvider>
            }
          />
          <Route path="/" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/:username"
            element={
              <GoogleMapsLoader>
                <ProfilePage />
              </GoogleMapsLoader>
            }
          />
          <Route path="/:username/edit" element={<EditProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
