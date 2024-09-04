"use client";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { apiRequest } from "../api-request";

const Login = () => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await apiRequest.login();
      await apiRequest.setTokenToCookie(res.payload.data.tokens.accessToken);
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="p-4 border-medium">
        <h1 className="text-3xl">Login</h1>
        <p>Log in to your account</p>
        <Input className="w-72" placeholder="Username" />
        <Button className="w-72" variant="solid" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
