"use client";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { apiRequest } from "../api-request";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Image from "next/image";

const Login = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async () => {
    try {
      // const res = await apiRequest.login();
      const token = "123";
      // await apiRequest.setTokenToCookie(res.payload.data.tokens.accessToken);
      await apiRequest.setTokenToCookie(token);
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-black p-10 rounded-3xl">
        <Image
          className="m-auto"
          src="/assets/vma-logo.png"
          alt="logo"
          width={90}
          height={90}
        />
        <p className="my-4 text-lg text-center">
          Đăng nhập vào tài khoản của bạn
        </p>
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
          className="bg-gradient-to-r from-indigo-500 to-emerald-500 w-full mt-6"
          variant="solid"
          // color="primary"
          onClick={handleLogin}
          size="lg"
        >
          <p className="text-white">Đăng nhập</p>
        </Button>
      </div>
    </div>
  );
};

export default Login;
