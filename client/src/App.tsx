import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import SignUpPage from "./features/auth/pages/SignUpPage.tsx";
import LogInPage from "./features/auth/pages/LogInPage.tsx";
import ProfilePage from "./features/profile/pages/ProfilePage.tsx";
import EditProfilePage from "./features/profile/pages/EditProfilePage.tsx";
import { Layout } from "./components/layout/Layout.tsx";
import SearchPage from "./features/search/pages/SearchPage.tsx";
import AllUsersList from "./features/search/components/AllUsersList.tsx";
import AllPlacesList from "./features/search/components/AllPlacesList.tsx";
import CreatePage from "./features/create/pages/CreatePage.tsx";
import CreatePlace from "./features/create/components/CreatePlace.tsx";
import CreateMap from "./features/create/components/CreateMap.tsx";
import AllMapsList from "./features/search/components/AllMapsList.tsx";
import { DraftMapProvider } from "./context/DraftMapContext.tsx";

export const BASE_URL = "http://localhost:5000/api";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/search" element={<SearchPage />}>
              <Route index element={<AllUsersList />} />
              <Route path="users" element={<AllUsersList />} />
              <Route path="places" element={<AllPlacesList />} />
              <Route path="maps" element={<AllMapsList />} />
            </Route>
            <Route path="/create" element={<CreatePage />}>
              <Route
                index
                element={
                  <DraftMapProvider>
                    <CreatePlace />
                  </DraftMapProvider>
                }
              />
              <Route
                path="places"
                element={
                  <DraftMapProvider>
                    <CreatePlace />
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
            <Route path="/" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/:username" element={<ProfilePage />} />
            <Route path="/:username/edit" element={<EditProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
