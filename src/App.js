import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
