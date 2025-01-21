import React from "react";
import RegisterForm from "@/components/form/RegisterForm";
import Image from "next/image";
import regImage from "@/public/reg.jpeg";
import logo from "@/public/Vector.png";


function RegistrationPage() {
  return (
    <main className="w-full md:min-h-screen flex">
      {/* Image Section */}
      <div className="relative hidden md:block flex-1">
        <Image
          className="object-cover w-full h-full"
          src={regImage}
          alt="Registration Image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
        />
      </div>

      {/* Registration Form Section */}
      <div className="flex-1 flex flex-col justify-center  p-6 md:p-12 lg:p-20 md:min-h-screen overflow-auto">
        <div className="w-full max-w-md py-6 mx-auto bg-white rounded-lg">
          <div className="flex justify-center mb-12">
            <div className="bg-black  inline-block p-2 px-6  rounded-md">
              <Image src={logo} alt="kokesa logo" />
            </div>
          </div>
          <h1 className=" text-2xl md:text-[2rem] text-center font-extrabold md:font-bold mb-4">
            Create an Account
          </h1>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}

export default RegistrationPage;
