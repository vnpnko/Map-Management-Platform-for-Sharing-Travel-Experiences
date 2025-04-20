import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DraftMapProvider } from "./context/DraftMapContext";
import { Layout } from "./common/layout/Layout";
import GoogleMapsLoader from "./common/components/GoogleMapsLoader.tsx";
import SignUpPage from "./pages/SignUp/SignUpPage.tsx";
import LogInPage from "./pages/LogIn/LogInPage.tsx";
import ProfilePage from "./pages/Profile/ProfilePage.tsx";
import EditProfilePage from "./pages/EditProfile/EditProfilePage.tsx";
import CreatePage from "./pages/Create/CreatePage";
import ExplorePage from "./pages/Explore/ExplorePage.tsx";
import PlacePage from "./pages/Place/PlacePage.tsx";
import MapPage from "./pages/Map/MapPage.tsx";

export const BASE_URL = "http://localhost:5000/api";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
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
          <Route
            path="/place/:id"
            element={
              <GoogleMapsLoader>
                <PlacePage />
              </GoogleMapsLoader>
            }
          />
          <Route
            path="/map/:id"
            element={
              <GoogleMapsLoader>
                <MapPage />
              </GoogleMapsLoader>
            }
          />
          <Route path="/:username/edit" element={<EditProfilePage />} />
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
          <Route
            path="/search"
            element={
              <GoogleMapsLoader>
                <ExplorePage />
              </GoogleMapsLoader>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
