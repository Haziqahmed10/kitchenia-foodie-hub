
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignupFormProps {
  signupData: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phone: string;
    address?: string;
  };
  isLoading: boolean;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SignupForm = ({ signupData, isLoading, errors, onChange, onSubmit }: SignupFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">Full Name</Label>
          <Input
            id="signup-name"
            name="name"
            placeholder="Your Name"
            value={signupData.name}
            onChange={onChange}
            required
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={signupData.email}
            onChange={onChange}
            required
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-phone">Phone Number</Label>
          <Input
            id="signup-phone"
            name="phone"
            placeholder="Your Phone Number"
            value={signupData.phone}
            onChange={onChange}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-address">Address (Optional)</Label>
          <Input
            id="signup-address"
            name="address"
            placeholder="Your Address"
            value={signupData.address || ""}
            onChange={onChange}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            value={signupData.password}
            onChange={onChange}
            required
            minLength={6}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
          <Input
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            value={signupData.confirmPassword}
            onChange={onChange}
            required
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>

        {errors.general && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full bg-kitchenia-orange hover:bg-orange-600"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignupForm;
