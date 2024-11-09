import Image from "next/image";
import LoginForm from "./login-form";

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Image src="/assets/login-bg.jpg" alt="logo" className="w-screen h-screen -z-50 blur-sm" sizes="100vh" fill={true} />
      {/* <div className="bg-white text-black p-10 rounded-3xl flex flex-col items-center justify-center shadow-2xl backdrop-brightness-100 bg-white/50"> */}
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-3xl flex flex-col items-center justify-center shadow-2xl">
        <Image className="" src="/assets/vma-logo.png" alt="logo" width={90} height={90} />
        <p className="my-4 text-lg text-center">Đăng nhập vào tài khoản của bạn</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
