
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Header from "./Header";
import ApiUrl from "./ApiUrl";

export default function UserSignIn() {
    const navigate = useNavigate();
    const [email_Address, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [user_id, setuserId] = useState("");
    const [showPassword, setShowPassword] = useState(false); // New state for toggling password visibility

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

    function validation() {
        var emailstatus = validationemail();
        var passwordstatus = validatepassword();
        if (emailstatus && passwordstatus) {
            return true;
        }
        return false;
    }

    const signin = () => {
        if (validation()) {
            axios.post(ApiUrl.SIGN_IN, { email_Address, password })
                .then(res => {
                    console.log("signin block called");
                    console.log(res.data.user_id);
                    setuserId(user_id);
                    let user = JSON.stringify(res.data.user);
                    console.log("User Data"+user);
                    localStorage.setItem("user", user);
                    localStorage.setItem("user_id", res.data.user_id);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Login Successfully",
                        showConfirmButton: false,
                        timer: 3000
                    });
                    navigate('/');
                })
                .catch(err => {
                    Swal.fire({
                        icon: "error",
                        title: "Unauthorized User",
                        text: "Invalid Username or Password ",
                        footer: '<a href="/userSignUp">create a new one?</a>'
                    });
                    console.log("error in sign in function"+err);
                });
        } else {
            toast.error("Please fill all fields");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return <>
        <Header/>
        <div className='container-fluid m-0 p-0' style={{ maxWidth: "100%", height: "100vh", backgroundColor: "" }}>
            <div className="container d-flex justify-content-center align-items-start min-vh-100" style={{ backgroundColor: "", marginTop: "10rem", height: "auto" }}>
                <div className="row border rounded-5 p-3 bg-white shadow box-area mt-5">
                    <div className="col-md-6 p-0 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ background: "#212529" }}>
                        <div className="featured-image">
                            <img src="./welcome.webp" className="rounded-4" style={{ width: "300px" }} />
                        </div>
                        <p className="text-white fs-2 mt-3 text" style={{ fontWeight: "600" }}>Be Verified</p>
                        <small className="text-white text-wrap text-center text" style={{ width: "17rem" }}>Create Your Survey With Our Platform.</small>
                    </div>
                    <div className="col-md-6 right-box">
                        <div className="row align-items-center">
                            <div className="header-text mb-4">
                                <h2>Hello Again</h2>
                                <p>We are happy to have you back.</p>
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    onKeyUp={() => validationemail()}
                                    onChange={event => setemail(event.target.value)}
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Email address"
                                />
                            </div>
                            <small className='text-danger' id='emailerror'></small>
                            <div className="input-group mt-3">
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
                                    className="btn btn-light ms-2"
                                    style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)" }}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <small className='text-danger' id='passworderror'></small>
                            <div className="input-group mb-5 d-flex justify-content-between">
                                {/* <div className="form-check" style={{ cursor: "pointer" }}>
                                    <input type="checkbox" className="form-check-input" id="formCheck" />
                                    <label htmlFor="formCheck" className="form-check-label text-secondary"><small>Remember Me</small></label>
                                </div> */}
                                {/* <div className="forgot">
                                    <small className='text-primary ' style={{ cursor: "pointer" }} >Forgot Password?</small>
                                </div> */}
                            </div>
                            <div className="input-group mb-3">
                                <button className="btn btn-lg btn-dark w-100 fs-6" onClick={() => signin()}>Login</button>
                            </div>

                            <div className="row">
                                <small className="text-center">Don't have an account? <a className='text-danger' onClick={() => navigate('/userSignUp')} style={{ cursor: "pointer" }}>Sign Up</a></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>   
}
