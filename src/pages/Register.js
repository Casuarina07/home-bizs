import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

function Register() {
  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const decoded = jwtDecode(token);

    const userData = {
      name: decoded.name,
      email: decoded.email,
      role_id: 2,
    };

    try {
      const res = await axios.post("/api/users/register", userData);
      localStorage.setItem("token", res.data.token);
      console.log("REGISTER -> user:", userData);

      // 🎉 Show toast depending on user status
      if (res.data.isNew) {
        toast.success("Welcome to HomeBizs!");
      } else {
        toast.info("Welcome back!");
      }

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "/menu";
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Registration failed.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <ToastContainer />
      <h2>Register with Google</h2>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error("Google login failed")}
      />
    </div>
  );
}

export default Register;
