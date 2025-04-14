import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { DraftMapProvider } from "./context/DraftMapContext";
import GoogleMapsLoader from "./common/components/GoogleMapsLoader.tsx";

import { Layout } from "./common/components/layout/Layout";
import SignUpPage from "./pages/SignUp/SignUpPage.tsx";
import LogInPage from "./pages/LogIn/LogInPage.tsx";
import ProfilePage from "./pages/Profile/ProfilePage.tsx";
import EditProfilePage from "./pages/EditProfile/EditProfilePage.tsx";

import ExplorePage from "./pages/Explore/ExplorePage";
import AllUsersList from "./pages/Explore/components/AllUsersList";
import AllPlacesList from "./pages/Explore/components/AllPlacesList";
import AllMapsList from "./pages/Explore/components/AllMapsList";

import CreatePage from "./pages/Create/CreatePage";
import CreatePlace from "./pages/Create/components/CreatePlace";
import CreateMap from "./pages/Create/components/CreateMap";

export const BASE_URL = "http://localhost:5000/api";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Explore Routes */}
            <Route path="/search" element={<ExplorePage />}>
              <Route index element={<AllUsersList />} />
              <Route path="users" element={<AllUsersList />} />
              <Route
                path="places"
                element={
                  <GoogleMapsLoader>
                    <AllPlacesList />
                  </GoogleMapsLoader>
                }
              />
              <Route
                path="maps"
                element={
                  <GoogleMapsLoader>
                    <AllMapsList />
                  </GoogleMapsLoader>
                }
              />
            </Route>

            {/* Create Routes */}
            <Route path="/create" element={<CreatePage />}>
              <Route
                index
                element={
                  <DraftMapProvider>
                    <GoogleMapsLoader>
                      <CreatePlace />
                    </GoogleMapsLoader>
                  </DraftMapProvider>
                }
              />
              <Route
                path="places"
                element={
                  <DraftMapProvider>
                    <GoogleMapsLoader>
                      <CreatePlace />
                    </GoogleMapsLoader>
                  </DraftMapProvider>
                }
              />
              <Route
                path="maps"
                element={
                  <DraftMapProvider>
                    <CreateMap />
                  </DraftMapProvider>
                }
              />
            </Route>

            {/* Auth & Profile */}
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
    </UserProvider>
  );
}

export default App;
