import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
//import UserContext from "../UserContexts.jsx";
import http from "../utils/http";
export default function LoginModal({ onClose, onSuccess, onRegister,onForgotPassword,
 }) {
  const { appName } = useContext(UserContext);
  const formik = useFormik({
    initialValues: {
      user: "village123",
      password: "pass123",
    },

    validationSchema: Yup.object({
      user: Yup.string()
        .required("ID is required"),

      password: Yup.string()
        .required("Password is required"),
    }),

     onSubmit: async (values) => {
    try {
      const response = await http({
        method: "POST",
        url: "auth/login",
        data: {
          username: values.user,
          password: values.password,
        },
      });

      console.log("Login Response:", response.data);

      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      onSuccess(response.data);
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.response?.data?.message || "Invalid username or password");
    }
  },
});

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lbox">
        <button className="lbox-close" onClick={onClose}>✕</button>

        <div className="lbox-head">
          <div className="lbox-logo">🌿</div>
          <h2>{appName} Portal</h2>
          <p>Sign in to access the village directory</p>
        </div>

        {/* SAME UI - ONLY FORMIK ADDED */}
        <form onSubmit={formik.handleSubmit}>
          
          <div className="lfield">
            <label>Mobile / Voter ID</label>
            <input
              type="text"
              name="user"
              value={formik.values.user}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your ID"
            />
          </div>

          <div className="lfield">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter password"
              onKeyDown={(e) => {
                if (e.key === "Enter") formik.handleSubmit();
              }}
            />
          </div>

          <button className="l-submit" type="submit">
            Sign In →
          </button>

          <div>
            <p>
              Don't have an account?
              <button
                className="l-register"
                type="button"
                onClick={onRegister}
              >
                New Register
              </button>
            </p>
          </div>
          <div style={{ textAlign: "right", marginTop: "3px" }}>
             <button
                type="button"
                className="l-register"
                onClick={onForgotPassword}
              >
                Forgot Password?
            </button>
        </div>

        </form>

        <div className="l-hint">
          Demo — ID: <strong>village123</strong> &nbsp;/&nbsp; Pass: <strong>pass123</strong>
        </div>
      </div>
    </div>
  );
}