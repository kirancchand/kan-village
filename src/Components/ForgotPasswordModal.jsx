import { useFormik } from "formik";
import * as Yup from "yup";

export default function ForgotPasswordModal({
  onClose,
  onBackToLogin,
}) {
  const formik = useFormik({
    initialValues: {
      mobile: "",
    },

    validationSchema: Yup.object({
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter valid 10-digit mobile number")
        .required("Mobile number is required"),
    }),

    onSubmit: (values) => {
      console.log("Forgot Password:", values);

      alert("OTP sent successfully");

      onBackToLogin();
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
          <div className="lbox-logo">🔐</div>
          <h2>Forgot Password</h2>
          <p>Enter your registered mobile number</p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="lfield">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter mobile number"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {(formik.touched.mobile ||
              formik.submitCount > 0) &&
              formik.errors.mobile && (
                <div className="error">
                  {formik.errors.mobile}
                </div>
              )}
          </div>

          <button className="l-submit" type="submit">
            Send OTP →
          </button>
        </form>
      </div>
    </div>
  );
}