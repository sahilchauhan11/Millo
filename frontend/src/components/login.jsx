import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice.js";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/user/login`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
        navigate("/", { replace: true });
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed");
      console.error(error);
    } finally {
      setLoading(false);
      setInput({ email: "", password: "" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">MILLO</h1>
          <p className="mt-2 text-xl font-medium text-gray-600">Look Share Connect</p>
          <p>Login to continue</p>
        </div>
        <form className="space-y-6" onSubmit={submitForm}>
          <div>
            <Label htmlFor="email" className="block text-sm font-bold text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-300"
              name="email"
              value={input.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-bold text-gray-700 ">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-300 "
              name="password"
              value={input.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {loading && (
            <div className="flex items-center justify-center text-gray-700">Signing in...</div>
          )}
          <Button type="submit" className="w-full bg-slate-700 text-white" disabled={loading}>
            Log In
          </Button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
