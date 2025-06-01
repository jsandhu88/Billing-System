import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";

export default function Login() {
  const location = useLocation();
  const path = location.pathname;
  const root = path === "/login" ? "Log in" : "Sign Up";
  console.log("Current path:", path);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("Submit button clicked");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("API URL:", `${import.meta.env.VITE_SERVER_LINK}/auth/signup`);

    if (path === "/login") {
      try {
        console.log("Attempting login...");
        const LogInData = await axios.post(
          `${import.meta.env.VITE_SERVER_LINK}/auth/login`,
          {
            email,
            password,
          }
        );
        console.log("Login response:", LogInData.data);

        const popupMsg =
          LogInData.data?.errors[0]?.msg || LogInData.data?.errors[0];
        (await popupMsg)
          ? toast.error(popupMsg, {
              style: {
                border: "1px solid #713200",
              },
            })
          : toast.success("Logged in Succefully!", {
              style: {
                border: "1px solid #713200",
              },
            });

        axios.defaults.headers.common[
          "authorization"
        ] = `Bearer ${LogInData.data?.token}`;

        localStorage.setItem("token", LogInData.data?.data.token);
        navigate("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred during login");
      }
    } else {
      try {
        console.log("Attempting signup...");
        const SignInData = await axios.post(
          `${import.meta.env.VITE_SERVER_LINK}/auth/signin`,
          {
            email,
            password,
          }
        );
        console.log("Signup response:", SignInData.data);

        navigate("/login");

        const popupMsg =
          SignInData.data?.errors[0]?.msg || SignInData.data?.errors[0];
        popupMsg
          ? toast.error(popupMsg, {
              style: {
                border: "1px solid #713200",
              },
            })
          : toast.success("Sign Up successful! Please login", {
              style: {
                border: "1px solid #713200",
              },
            });
      } catch (error) {
        console.error("Signup error:", error);
        toast.error("An error occurred during signup");
      }
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6  lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto" src={logo} alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {root} to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md
                cursor-pointer
                 bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {root}
              </button>
              <Toaster />
            </div>
          </div>

          {root === "Log in" && (
            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <NavLink
                to="/signup"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign up now!
              </NavLink>
            </p>
          )}
          {root === "Sign Up" && (
            <p className="mt-10 text-center text-sm text-gray-500">
              Already a member?{" "}
              <NavLink
                to="/login"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Log in
              </NavLink>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
