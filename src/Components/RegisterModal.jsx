import React,{useCallback,useEffect} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext,useState } from "react";
import UserContext from "../UserContext.jsx";
import http from "../utils/http";
import { REGISTER_USER, appId,GET_ALLGENDER } from "../utils/constants.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
export default function RegisterModal({ onClose, onLogin }) {
  const { appName } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [genderData, setGenderData] = useState([]);

  const getGender = useCallback(async () => {
    try {
      const res = await http.post(GET_ALLGENDER);
      console.log("Fetched Categories data:", res.data);
      setGenderData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch Categories data", err);
    }
  }, []);
  useEffect(() => {
    getGender();
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      password: "",
      dateOfBirth: "",
      gender: null,
      status: null,
      usertype: null,
      branch:{
        value:localStorage.getItem("village_branch_id"),
        label:localStorage.getItem("village_branch")
      },
      appId: appId,
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobileNo: Yup.string()
        .required("Mobile Number is required")
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
      password: Yup.string()
        .min(6, "Minimum 6 characters required")
        .required("Password is required"),
      dateOfBirth: Yup.date().required("Date of Birth is required"),
      gender: Yup.object().required("Gender is required"),
    }),
    onSubmit: async (values) => {
      const formattedDate = values.dateOfBirth.split("-").reverse().join("/");
      const registerData = {
        username: values.mobileNo,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobno: values.mobileNo,
        password: values.password,
        dateofbirth: formattedDate,
        gender: values.gender,
        status: null,
        usertype: null,
        branch:values.branch,
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
        if(res.status==200){
          alert("User registered successfully");
          onLogin();
          onClose();
        }
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

    // {
    //     "_index": "kan_userregister",
    //     "_id": "a03f52c4-c407-4f7b-a429-1d8928b8c41f",
    //     "_score": 1,
    //     "_source": {
    //       "_class": "com.project.kan.common.vo.ElasticUserRequest",
    //       "id": "a03f52c4-c407-4f7b-a429-1d8928b8c41f",
    //       "keycloakId": "53658b4e-f5cb-4268-beb8-158866ae8ed5",
    //       "username": "9061315676",
    //       "email": "arunamk9@gmail.com",
    //       //"firstName": "aruna",
    //       //"lastName": "mk",
    //       "mobno": "9061315676",
    //       //"dateofbirth": "02/08/2026",
    //       //"gender": "Female",
    //       "status": "Active",
    //       "usertype": "Authorised User",
    //       //"branch": "palode"
    //     }
    //   },

    //    {
    //     "_index": "kanuser",
    //     "_id": "W8ezs5kB3Li4KCj6imQF",
    //     "_score": 3.0316584,
    //     "_source": {
    //       "state": "Kerala",
    //       "district": "Thiruvananthapuram",
    //       "local_body_type": "Panchayat",
    //       "local_body_name": "Nanniyode",
    //       "ward": "PALODE",
    //       "SerialNo": 30,
    //       "Name": "Anithakumari",
    //       "Guardian": "Peetahmbaran Nair",
    //       "HouseNo": "005/302",
    //       "HouseName": "Krishna Vilasam",
    //       "Gender": "F",
    //       "Age": 55,
    //       "ID": "SEC032303453"
    //     }
    //   },

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lbox register-box">
        <button className="lbox-close" onClick={onClose}>
          ✕
        </button>

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
              value={formik.values.gender?.value || ""}
              onChange={(e) => {
                const selectedGender = genderData.find(
                  (gender) => gender.value === e.target.value
                );

                formik.setFieldValue("gender", selectedGender || null);
              }}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Gender</option>

              {genderData.map((gender) => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
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
            <label>Mobile Number (UserName)</label>

            <input
              type="text"
              name="mobileNo"
              placeholder="Enter Mobile Number"
              value={formik.values.mobileNo}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                formik.setFieldValue("mobileNo", value);
              }}
              onBlur={formik.handleBlur}
              maxLength={10}
            />

            {formik.touched.mobileNo && formik.errors.mobileNo && (
              <div className="error">{formik.errors.mobileNo}</div>
            )}
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
    />

    <i
      className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-eye`}
      onClick={() => setShowPassword(!showPassword)}
    ></i>
  </div>

  {formik.touched.password && formik.errors.password && (
    <div className="error">{formik.errors.password}</div>
  )}
</div>

          <button className="l-submit" type="submit">
            Register →
          </button>
          <div className="auth-switch">
            <span>Already have an account?</span>
            <button type="button" className="link-btn" onClick={onLogin}>
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
