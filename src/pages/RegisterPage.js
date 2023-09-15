import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {Link, Navigate } from "react-router-dom";
import { register } from "../redux/authslice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { registered, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password1: "",
  });

  const { email, username, password, password1 } = formData;

  const onchange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const userRegister = async (e) => {
    e.preventDefault();
    if (password === password1) {
      dispatch(register({ username, email, password }));
    } else {
      toast.error("Password mis-match");
    }
  };

  if (registered) return <Navigate to="/" />;

  return (
    <>
      <section className="vh-100 gradient-custom bg-gradient-to-br from-violet-400 via-white to-violet-400" title="Auth site | register">
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div
                  className="card bg-black text-white"
                  style={{ borderRadius: "1rem", border: "2px solid red" }}
                >
                  <div className="card-body p-4 p-md-5 text-center">
                    <h2 className="fw-bold mb-3 text-uppercase">
                      Create an account
                    </h2>

                    <form onSubmit={userRegister}>
                      <div className="form-outline form-dark mb-3">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={onchange}
                          required
                          className="form-control form-control-lg"
                          placeholder="Enter Your Email"
                        />
                        <label className="form-label" htmlFor="email">
                          Your Email
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          id="username"
                          name="username"
                          type="text"
                          value={username}
                          onChange={onchange}
                          required
                          className="form-control form-control-lg"
                          placeholder="Enter Your Username"
                        />
                        <label className="form-label" htmlFor="username">
                          Your Username
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={password}
                          onChange={onchange}
                          required
                          className="form-control form-control-lg"
                          placeholder="Enter Your Password"
                        />
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          id="password1"
                          name="password1"
                          type="password"
                          value={password1}
                          onChange={onchange}
                          required
                          className="form-control form-control-lg"
                          placeholder="Repeat your password"
                        />
                        <label className="form-label" htmlFor="password1">
                          Repeat your password
                        </label>
                      </div>

                      <div className="d-flex justify-content-center">
                        {loading ? (
                          <div
                            class="spinner-border text-success"
                            role="status"
                          >
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-outline-danger btn-lg px-5"
                          >
                            Register
                          </button>
                        )}
                      </div>

                      <p className="text-center  mt-5 mb-0">
                        Have already an account?{" "}
                        <Link to={"/"} className="text-red fw-bold text-green-900">
                          <u>Login here</u>
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;
