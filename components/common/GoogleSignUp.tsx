import React from "react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

interface Props {
  login?: boolean;
}

function GoogleSignUp({ login }: Props) {
  return (
    <>
      {/* Divider */}
      <div className="flex items-center gap-2 mt-8">
        <div className="border-t border-gray-300 flex-1"></div>
        <p className="text-sm text-gray-600">
          {login ? "OR sign in with" : "OR sign up with"}
        </p>
        <div className="border-t border-gray-300 flex-1"></div>
      </div>

      {/* Google Signup Button */}
      <div className="flex flex-col items-center justify-center mt-6">
        <button
          className="flex items-center py-2 px-4 gap-4 justify-center shadow-md w-full max-w-sm rounded-md bg-white 
                     text-gray-800 hover:bg-gray-100 hover:shadow-lg focus:outline-none
                     active:scale-95 transition-transform duration-150"
          aria-label={login ? "Sign in with Google" : "Sign up with Google"}
        >
          <FcGoogle size={24} />
          <p className="text-lg font-medium">
            {login ? "Sign in" : "Sign up"} with Google
          </p>
        </button>

        {/* Footer Link */}
        <p className="text-center text-neutral mt-3 text-sm">
          Already a registered user?
          <Link
            href={login ? "./registration" : "./login"}
            className="text-primary ml-1 underline font-semibold"
          >
            {login ? "sign up" : "sign in"}
          </Link>
        </p>
      </div>
    </>
  );
}

export default GoogleSignUp;
