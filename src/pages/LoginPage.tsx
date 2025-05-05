
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
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
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await signIn(loginData.email, loginData.password);
      
      // Redirect handled by useEffect when user changes
    } catch (error) {
      // Error handling is done in the AuthContext
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Password error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      full_name: signupData.name,
      phone: signupData.phone,
    };

    try {
      setIsLoading(true);
      await signUp(signupData.email, signupData.password, userData);
      
      // Redirect will happen through useEffect when user state changes
    } catch (error) {
      // Error handling is done in the AuthContext
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
