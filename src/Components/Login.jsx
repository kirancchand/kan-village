import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext, useState } from "react";
import UserContext from "../UserContext.jsx";
import http from "../utils/http";
import { LOGIN_USER } from "../utils/constants.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
export default function LoginModal({
  onClose,
  onSuccess,
  onRegister,
  onForgotPassword,
}) {
  const { appName } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "village123",
      password: "pass123",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("ID is required"),

      password: Yup.string().required("Password is required"),
    }),

    onSubmit: async (values) => {
      // if (values.username === "village123" && values.password === "pass123") {
      //   onSuccess();
      // } else {
      //   alert("Invalid credentials");
      // }
      try {
        const res = await http.post(LOGIN_USER, values);
        console.log("User logged in successfully:", res.data);
        if (res.data && res.data.access_token) {
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("refresh_token", res.data.refresh_token);
          onSuccess();
        }
      } catch (err) {
        console.error("Failed to login user", err);
         if (values.username === "village123" && values.password === "pass123") {
            onSuccess();
          } else {
            alert("Invalid credentials");
          }
      }
    },
  });

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lbox">
        <button className="lbox-close" onClick={onClose}>
          ✕
        </button>

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
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your ID"
            />
          </div>

          <div className="lfield">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter password"
              />

              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-eye`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          <button className="l-submit" type="submit">
            Sign In →
          </button>

          <div>
            <p>
              Don't have an account?
              <button className="l-register" type="button" onClick={onRegister}>
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
          Demo — ID: <strong>village123</strong> &nbsp;/&nbsp; Pass:{" "}
          <strong>pass123</strong>
        </div>
      </div>
    </div>
  );
}
