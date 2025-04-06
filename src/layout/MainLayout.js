import Header from "../components/Header";
import Footer from "../components/Footer";
import "./MainLayout.css"; // Create this if you haven’t yet

const MainLayout = ({ children }) => (
  <div className="layout-wrapper">
    <Header />
    <main className="main-content">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;
