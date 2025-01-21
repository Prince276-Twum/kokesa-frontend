import React from "react";
import Image from "next/image";
import logo from "@/public/Vector.png";
import Button from "@/components/UI/Button";

function RedirectEmailPage() {
  return (
    <main className="flex justify-center items-center p-4 bg-white mt-20">
      <div className="bg-white rounded-md shadow-lg max-w-[450px] w-full px-6 py-8">
        <div className="flex justify-center mb-6">
          <div className="bg-black p-2 rounded-md">
            <Image src={logo} alt="kokesa logo" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 ">Verify Your Email</h2>
          <p className="mb-6 text-lg  leading-6 text-neutral-gray">
            Please go to your email to verify your email address.
          </p>
          <Button el="anchor" href="mailto" primary rounded>
            Login to Setup Your Business
          </Button>
        </div>
      </div>
    </main>
  );
}

export default RedirectEmailPage;
