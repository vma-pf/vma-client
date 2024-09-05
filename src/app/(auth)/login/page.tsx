"use client";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { apiRequest } from "../api-request";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Login = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

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
    <div className="h-screen flex items-center justify-center">
      <div className="p-10 border-medium rounded-xl ">
        <p className="mb-4 text-3xl text-center">VMA-PF</p>
        <p className="mb-4 text-3xl text-center">Đăng nhập</p>
        <p className="my-4">Đăng nhập vào tài khoản của bạn</p>
        <Input
          className="w-80 mb-5"
          type="text"
          label="Tên đăng nhập"
          isRequired
        />
        <Input
          className="w-80 mt-5"
          label="Mật khẩu"
          isRequired
          endContent={
            <Button isIconOnly variant="light" onClick={toggleVisibility}>
              {isVisible ? (
                <FaEye className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
              )}
            </Button>
          }
          type={isVisible ? "text" : "password"}
        />
        <Button
          className="w-full mt-6"
          variant="solid"
          color="primary"
          onClick={handleLogin}
          size="lg"
        >
          Đăng nhập
        </Button>
      </div>
    </div>
  );
};

export default Login;
