import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Loader2, GraduationCap, UserCog } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      navigate(
        role === "student" ? "/student-dashboard" : "/teacher-dashboard"
      );
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        password,
        role,
        ...(role === "student" ? { sapId: userId } : { teacherId: userId }),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        payload
      );

      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem(role === "student" ? "sapId" : "teacherId", userId);

      if (response.data.role === "student") {
        navigate(`/student-dashboard`);
      } else {
        navigate(`/teacher-dashboard`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getIdLabel = () => {
    return role === "student" ? "SAP ID" : "Teacher ID";
  };

  const handleTabChange = (value) => {
    setRole(value);
    setUserId("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand Section */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-900 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Assessment Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Department of Information Technology
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <Tabs value={role} onValueChange={handleTabChange} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger
                  value="student"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Student
                </TabsTrigger>
                <TabsTrigger
                  value="teacher"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  Teacher
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="mt-6">
              {error && (
                <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center text-red-600 text-sm">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <TabsContent value="student" className="mt-0">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sapId"
                      className="text-sm font-medium text-gray-700"
                    >
                      SAP ID
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="sapId"
                        placeholder="Enter your SAP ID"
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="teacher" className="mt-0">
                  <div className="space-y-2">
                    <Label
                      htmlFor="teacherId"
                      className="text-sm font-medium text-gray-700"
                    >
                      Teacher ID
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="teacherId"
                        placeholder="Enter your Teacher ID"
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign in
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          © 2024 Assessment Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
