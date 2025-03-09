import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ImagePage from "./pages/ImagePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:username/:imagename" element={<ImagePage />} />
      </Routes>
    </Router>
  );
}