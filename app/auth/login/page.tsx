import LoginForm from "@/components/form/LoginForm";
import Image from "next/image";
import React from "react";
import logo from "@/public/Vector.png";
import alarmImg from "@/public/loginalarm.png";
import type { Metadata } from "next";




export const metadata: Metadata = {
  title: "Kokesa | Sign In",
  description:
    "Log in to your Kokesa account to manage bookings and access your dashboard.",
};

function LoginPage() {
  return (
    <main>
      <div className="flex md:min-h-screen w-full">
        <div className="flex-1 relative md:block hidden">
          <Image
            src={alarmImg}
            alt="a 3D rendering of an abstract sculpture"
            className=" object-cover w-full h-full "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
          ></Image>
        </div>

        <div className="flex flex-col justify-center flex-1 w-full  p-6 md:p-12 lg:p-20 md:min-h-screen overflow-auto">
          <div className="max-w-md w-full mt-6 mx-auto mb-4">
            <div className="flex justify-center mb-12">
              <div className="bg-black  inline-block p-2 px-6  rounded-md">
                <Image src={logo} alt="kokesa logo" />
              </div>
            </div>
            <h2 className=" text-2xl md:text-[2rem] text-center font-extrabold md:font-bold mb-4">
              Sign In
            </h2>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
{
  /* Login with your email */
}

export default LoginPage;
