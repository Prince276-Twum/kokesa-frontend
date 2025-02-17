"use client";
import Button from "@/components/UI/Button";
import logo from "@/public/Vector.png";
import { useActivationMutation } from "@/store/features/authApiSlice";
import Image from "next/image";
import { use, useEffect } from "react";

interface Props {
  params: Promise<{ uid: string; token: string }>;
}

function Page({ params }: Props) {
  const [activate, { isError, isSuccess }] = useActivationMutation();
  const { uid, token } = use(params);

  useEffect(() => {
    activate({ uid, token });
  }, [uid, token, activate]);

  let content;

  if (isError) {
    content = (
      <div
        role="alert"
        aria-live="assertive"
        className="p-6 bg-red-100 text-red-700 rounded-lg"
      >
        <h2 className="text-3xl font-bold mb-4">Email Verification Failed</h2>
        <p className="text-lg leading-6 mb-4">
          This link has already been used. If you didn't verify your email,
          please request a new one.
        </p>
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div
        role="status"
        aria-live="assertive"
        className="p-6 bg-green-100 text-green-700 rounded-lg mb-4"
      >
        <h2 className="text-3xl font-bold mb-4">
          Email Verification Successful!
        </h2>
        <p className="text-lg leading-6 mb-4">
          Your email has been successfully verified. You can now log in and set
          up your business.
        </p>
      </div>
    );
  }

  return (
    <main className="flex justify-center items-center p-4 bg-white mt-20">
      <div className="bg-white rounded-md shadow-lg max-w-[450px] w-full px-6 py-8">
        <div className="flex justify-center mb-6">
          <div className="bg-black p-2 rounded-md">
            <Image src={logo} alt="kokesa logo" />
          </div>
        </div>

        <div className="text-center">
          {content}

          <Button primary rounded el="anchor" href="/auth/login">
            Login to Setup Your Business.
          </Button>
        </div>
      </div>
    </main>
  );
}

export default Page;
