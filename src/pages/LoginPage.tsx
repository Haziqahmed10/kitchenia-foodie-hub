
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = new URLSearchParams(location.search).get("from") || "/";
      navigate(from);
    }
  }, [user, navigate, location]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setLoginError(null);
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    setSignupErrors({});
  };

  const validateSignupData = () => {
    const errors: Record<string, string> = {};
    
    if (!signupData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!signupData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (signupData.phone && !/^\+?[0-9]{10,15}$/.test(signupData.phone.replace(/[-\s]/g, ''))) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (!signupData.password) {
      errors.password = "Password is required";
    } else if (signupData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    return errors;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    try {
      setIsLoading(true);
      await signIn(loginData.email, loginData.password);
      // Redirect handled by useEffect when user changes
    } catch (error: any) {
      setLoginError(error.message || "Login failed. Please check your credentials and try again.");
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateSignupData();
    if (Object.keys(validationErrors).length > 0) {
      setSignupErrors(validationErrors);
      return;
    }

    const userData = {
      full_name: signupData.name,
      phone: signupData.phone,
      address: signupData.address,
    };

    try {
      setIsLoading(true);
      await signUp(signupData.email, signupData.password, userData);
      
      toast({
        title: "Account created successfully",
        description: "Please check your email for verification instructions.",
      });
      
      // Clear form
      setSignupData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        address: "",
      });
      setIsLoading(false);
    } catch (error: any) {
      setSignupErrors({
        general: error.message || "Failed to create account. Please try again."
      });
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="section-container py-12 min-h-[70vh] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <LoginForm 
                email={loginData.email}
                password={loginData.password}
                isLoading={isLoading}
                error={loginError}
                onChange={handleLoginChange}
                onSubmit={handleLogin}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Sign up to order delicious food
                </CardDescription>
              </CardHeader>
              <SignupForm
                signupData={signupData}
                isLoading={isLoading}
                errors={signupErrors}
                onChange={handleSignupChange}
                onSubmit={handleSignup}
              />
            </Card>
          </TabsContent>
        </Tabs>
        
        <p className="text-center mt-6 text-gray-600">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
