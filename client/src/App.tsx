import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import { Layout } from "./pages/Layout/Layout.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import AllUsersList from "./components/search/AllUsersList.tsx";
import AllPlacesList from "./components/search/AllPlacesList.tsx";
import { Text } from "@chakra-ui/react";
import CreatePage from "./pages/CreatePage.tsx";
import CreatePlace from "./components/create/CreatePlace.tsx";

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
              <Route
                path="maps"
                element={<Text color={"black"}>not ready</Text>}
              />
            </Route>
            <Route path="/create" element={<CreatePage />}>
              <Route index element={<CreatePlace />} />
              <Route path="places" element={<CreatePlace />} />
              <Route
                path="maps"
                element={<Text color={"black"}>not ready</Text>}
              />
            </Route>
            <Route path="/create" element={<CreatePage />} />
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
