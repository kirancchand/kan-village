import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import UserContext from "../UserContext.jsx";
import http from "../utils/http";
import { REGISTER_USER,appId } from "../utils/constants.jsx";
export default function RegisterModal({ onClose, onLogin }) {
const { appName } = useContext(UserContext);
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      userNameOrMobile: "",
      password: "",
      dateOfBirth: "",
      gender: "",
      status:null,
      usertype:null,
      appId: appId,
    },

    validationSchema: Yup.object({
  firstName: Yup.string().required("First Name is required"),

  lastName: Yup.string().required("Last Name is required"),

  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  userNameOrMobile: Yup.string()
  .required("Username or Mobile Number is required"),

  password: Yup.string()
    .min(6, "Minimum 6 characters required")
    .required("Password is required"),

  dateOfBirth: Yup.date()
    .required("Date of Birth is required"),

  gender: Yup.string()
    .required("Gender is required"),
}),
onSubmit: async(values) => {
  const registerData = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    username: values.username,
    mobno: values.mobileNo,
    password: values.password,
    dateofbirth: values.dateOfBirth,
    gender: values.gender,
    status:null,
    usertype:null,
    appId: appId,
  };


//   {
//     "username": "9567894563",
// 	"firstName":"name105",//
// 	"middleName":"name 2",
// 	"lastName":"name 3",//
// 	"email":"kiran105@gmail.com",//
//     "mobno":"9567894563",//
//     "password":"123456" ,//
// 	"dateofbirth":"21/01/2022",
//     "gender": {
//         "value":1,
//         "label":"male"
//     },
//     "status":null,
//     "usertype": null,
//     // "status":{
//     //     "value":1,
//     //     "label":"Active"
//     // },
//     // "usertype":{
//     //     "value":1,
//     //     "label":"admin"
//     // },
//     // "branch":{
//     //     "value":2,
//     //     "label":"ward name"
//     // },
//     "appId":1
//     // "created_time":"21/01/2022",
// 	// "updated_time":"21/01/2022"
// }





   try {
        const res = await http.post(REGISTER_USER, registerData);
        console.log("User registered successfully:", res.data);
      } catch (err) {
        console.error("Failed to register user", err);
      }

  console.log(registerData);

  // API call here
  // axios.post("/register", registerData);

  // onLogin();
  // onClose();
},
  });

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lbox register-box">
        <button className="lbox-close" onClick={onClose}>✕</button>

        <div className="lbox-head">
          <div className="lbox-logo">🌿</div>
          <h2>Join {appName} Portal</h2>
          <p>Create an Account</p>
        </div>

        
  <form onSubmit={formik.handleSubmit}>
       <div className="name-row">
           <div className="lfield">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="error">{formik.errors.firstName}</div>
                  )}
                </div>

                <div className="lfield">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="error">{formik.errors.lastName}</div>
                  )}
                </div>

                <div className="lfield">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>

                  {formik.touched.gender && formik.errors.gender && (
                    <div className="error">{formik.errors.gender}</div>
                  )}
                </div>
              </div>

              <div className="name-row">
                <div className="lfield">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <div className="error">{formik.errors.dateOfBirth}</div>
                  )}
                </div>

                <div className="lfield">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="error">{formik.errors.email}</div>
                  )}
                </div>
              </div>
          <div className="lfield">
                <label>Username / Mobile Number</label>
                <input
                  type="text"
                  name="userNameOrMobile"
                  placeholder="Enter Username or Mobile Number"
                  value={formik.values.userNameOrMobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.userNameOrMobile &&
                  formik.errors.userNameOrMobile && (
                    <div className="error">
                      {formik.errors.userNameOrMobile}
                    </div>
                  )}
              </div>
                        <div className="lfield">
                            <label>Password</label>
                            <input
                              type="password"
                              name="password"
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.password && formik.errors.password && (
                              <div className="error">{formik.errors.password}</div>
                            )}
                        </div>

                      

                        <button className="l-submit" type="submit">
                          Register →
                        </button>
                        <div className="auth-switch">
                <span>Already have an account?</span>
                <button
                  type="button"
                  className="link-btn"
                  onClick={onLogin}
                >
                  Sign In
                </button>
              </div>

                      </form> 
                    </div>
                  </div>
                  
                );
              }