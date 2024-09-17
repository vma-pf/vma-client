import Image from "next/image";
import LoginForm from "./login-form";

const Login = () => {
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
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
