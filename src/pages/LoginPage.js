/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetRegistered, login } from "../redux/authslice";
import {Link, useNavigate } from "react-router-dom";
import "../index.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, registered, isSuperuser } = useSelector(
    (state) => state.user
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (registered) {
      dispatch(resetRegistered());
    }
  }, [dispatch, registered]);

  useEffect(() => {
    if (isAuthenticated) {
      if (isSuperuser) {
        navigate("/adm");
      } else {
        navigate("/home");
      }
    } else {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <>
      <div title="Auth site | login" content="login page">
        <section className="vh-100 gradient-custom bg-gradient-to-br from-violet-400 via-white to-violet-400">
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div
                  className="card bg-black text-white"
                  style={{ borderRadius: "1rem", border: "2px solid red" }}
                >
                  <div className="card-body p-4 p-md-5 text-center">
                    <form onSubmit={handleLogin}>
                      <div className="mb-4">
                        <h2 className="fw-bold mb-3 text-uppercase">Login</h2>
                        <p className="text-white mb-4">
                          Please enter your login and password!
                        </p>

                        <div className="form-outline form-dark mb-3">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="form-control form-control-lg"
                            placeholder="Email"
                          />
                        </div>

                        <div className="form-outline form-black mb-4">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={onChange}
                            required
                            className="form-control form-control-lg"
                            placeholder="Password"
                          />
                        </div>

                        <p className="small mb-4">
                          <a className="text-dark" href="#!">
                            Forgot password?
                          </a>
                        </p>

                        <div>
                          {loading ? (
                            <div
                              className="spinner-border text-success"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          ) : (
                            <button
                              className="btn btn-outline-danger btn-lg px-5"
                              type="submit"
                            >
                              Login
                            </button>
                          )}
                        </div>
                        <div className="d-flex justify-content-center text-center mt-4 pt-1">
                          <a href="#!" className="text-dark">
                            <i className="fab fa-facebook-f fa-lg"></i>
                          </a>
                          <a href="#!" className="text-dark">
                            <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                          </a>
                          <a href="#!" className="text-dark">
                            <i className="fab fa-google fa-lg"></i>
                          </a>
                        </div>
                      </div>
                    </form>
                    <div>
                      <p className="mb-0">
                        Don't have an account?
                        <Link to={"/register"} className="text-green-800 font-extrabold">
                          Sign Up
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LoginPage;
