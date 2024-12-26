import React from "react";
import RegisterForm from "@/components/form/Register";
import Image from "next/image";
import regImage from "@/public/reg.jpeg";

function RegistrationPage() {
  return (
    <main className="w-full flex">
      {/* Image Section */}
      <div className="flex-1 hidden md:block relative h-screen w-full">
        <Image
          className="object-cover w-full h-full"
          src={regImage}
          alt="Registration Image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
        />
      </div>

      {/* Registration Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-md p-6 bg-white rounded-lg">
          <h1 className="text-2xl text-center font-semibold mb-4">
            Create an Account
          </h1>
          {/* <div className="w-full border-b mb-4 border-formBorder"></div> */}
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}

export default RegistrationPage;
