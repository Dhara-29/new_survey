
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from 'sweetalert2';
import { useState } from "react";
import axios from 'axios';
import Header from "./Header";
import "react-toastify/dist/ReactToastify.css"; // Ensure you have the CSS import

import ApiUrl from "./ApiUrl";

export default function UserSignUp() {
    const [user_name, setName] = useState("");
    const [email_Address, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility

    const navigate = useNavigate();

    const validationname = () => {
        console.log(user_name);
        var status = true;
        var nameerror = document.getElementById("name");
        if (user_name.length === 0) {
            status = false;
            nameerror.innerHTML = "Name is required";
        } else if (!isNaN(user_name)) {
            status = false;
            nameerror.innerHTML = "Name must be a character";
        } else {
            status = true;
            nameerror.innerHTML = "";
        }
        return status;
    };

    const validatepassword = () => {
        var status = true;
        var passworderror = document.getElementById("passworderror");
        if (password.length === 0) {
            status = false;
            passworderror.innerHTML = "Password is required";
        } else if (password.length <= 5) {
            passworderror.innerHTML = "Password must be more than 5 characters";
        } else {
            status = true;
            passworderror.innerHTML = "";
        }
        return status;
    };

    const validationemail = () => {
        var status = true;
        var emailError = document.getElementById("emailerror");
        if (email_Address.length === 0) {
            status = false;
            emailError.innerHTML = "Email id is required";
        } else {
            let atTheRateIndex = email_Address.indexOf("@");
            if (atTheRateIndex === -1) {
                status = false;
                emailError.innerHTML = "Invalid email (@ not present)";
                return status;
            }
            let lastIndexOfAtTheRate = email_Address.lastIndexOf("@");
            if (atTheRateIndex !== lastIndexOfAtTheRate) {
                status = false;
                emailError.innerHTML = "Invalid email (2 @ present)";
                return status;
            }

            let stringAfterAtTheRate = email_Address.substring(atTheRateIndex);
            let dotIndex = stringAfterAtTheRate.lastIndexOf(".");
            if (dotIndex === -1) {
                status = false;
                emailError.innerHTML = "Invalid email (. not present)";
                return status;
            }

            let domainString = stringAfterAtTheRate.substring(dotIndex);
            if (!(domainString === ".in" || domainString === ".com")) {
                status = false;
                emailError.innerHTML = "Invalid email (.in or .com not present)";
                return status;
            }

            if (email_Address.charAt(0) === '@') {
                status = false;
                emailError.innerHTML = "Invalid email (starting with @)";
                return status;
            }

            emailError.innerHTML = "";
        }
        return status;
    };

    function validation() {
        var fnamestatus = validationname();
        var emailstatus = validationemail();
        var passwordstatus = validatepassword();
        if (fnamestatus && emailstatus && passwordstatus) {
            return true;
        }
        return false;
    }

    const createAccount = () => {
        if (validation()) {
            axios.post(ApiUrl.SIGN_UP, { user_name, email_Address, password })
                .then(res => {
                    // Assuming that the success response does not have an error field
                    if (res.status === 200) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Account Created Successfully",
                            showConfirmButton: false,
                            timer: 3000
                        });
                        let user = JSON.stringify(res.data.user);
                        console.log(user);

                        // localStorage.setItem("user", user);
                        // localStorage.setItem("userId", res.data.user.id);
                        navigate("/userSignIn");
                    }

                })
                .catch(err => {
                    if (err.status === 400) {
                        // Handle known error for already signed-up users
                        Swal.fire({
                            icon: "warning",
                            title: "User already signed up",
                            text: "The email or username is already in use.",
                        });
                    } else {
                        // Handle other errors
                        console.log(err);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                        });
                    }
                });
        } else {
            toast.error("Please fill all the fields");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Header />
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className='container-fluid m-0 p-0 mt-5' style={{ maxWidth: "100%", height: "100vh", backgroundColor: "" }}>
                <div className="container d-flex justify-content-center align-items-start min-vh-100" style={{ backgroundColor: "", marginTop: "10rem", height: "auto" }}>
                    <div className="row border rounded-5 p-3 bg-white shadow box-area mt-4">
                        <div className="col-md-6 p-0 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ background: "#212529" }}>
                            <div className="featured-image">
                                <img src="./welcome.webp" className="rounded-4" style={{ width: "350px" }} />
                            </div>
                            <small className="text-white text-wrap text-center text" style={{ width: "17rem" }}>.</small>
                        </div>
                        <div className="col-md-6 right-box">
                            <div className="row align-items-center">
                                <div className="header-text">
                                    <h2>Welcome,</h2>
                                    <p className='ms-2'>We are happy to have you come here.</p>
                                </div>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        onKeyUp={() => validationname()}
                                        onChange={event => setName(event.target.value)}
                                        className="form-control form-control-lg bg-light fs-6"
                                        placeholder="Username"
                                    />
                                </div>
                                <small className='text-danger' id='name'></small>
                                <div className="input-group mt-3">
                                    <input
                                        type="text"
                                        onKeyUp={() => validationemail()}
                                        onChange={event => setemail(event.target.value)}
                                        className="form-control form-control-lg bg-light fs-6"
                                        placeholder="Email address"
                                    />
                                </div>
                                <small className='text-danger' id='emailerror'></small>
                                <div className="input-group mt-3 position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        onKeyUp={() => validatepassword()}
                                        onChange={event => setpassword(event.target.value)}
                                        className="form-control form-control-lg bg-light fs-6"
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="btn btn-light position-absolute end-0 top-50 translate-middle-y me-2"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                <small className='text-danger' id='passworderror'></small>
                                <div className="input-group mt-5 mb-3">
                                    <button
                                        className="btn btn-lg btn-dark w-100 fs-6"
                                        onClick={() => createAccount()}
                                    >
                                        Sign up
                                    </button>
                                </div>
                                <div className="row">
                                    <small className="text-center">Already have an account? <a className='text-danger text-center' onClick={() => navigate('/userSignIn')} style={{ cursor: "pointer" }}>Log in</a></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
