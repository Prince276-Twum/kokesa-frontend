"use client";
import React, { FormEvent, useState } from "react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import GoogleSignUp from "../common/GoogleSignUp";
import useEmailValidation from "@/hooks/useEmailValidation";

function LoginForm() {
  const { email, emailError, handleEmailChange, checkEmailValidity } =
    useEmailValidation();
  const [enterdPassword, setEnterdPassword] = useState("");
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (enterdPassword == "") {
      setIsPasswordEmpty(true);
    }
    if (!checkEmailValidity()) {
      return;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <Input
            placeholder="Enter Your Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              handleEmailChange(e.target.value);
            }}
            cn={emailError ? "border-red-500" : ""}
            aria-describedby="email-error"
          >
            Email
          </Input>

          {emailError && (
            <p id="email-error" className="text-red-500 ">
              {emailError}
            </p>
          )}
        </div>

        <div>
          <Input
            aria-describedby="password-error"
            cn={isPasswordEmpty ? "border-red-500" : ""}
            placeholder="Enter Your Password"
            id="password"
            type="email"
            onChange={(e) => {
              setEnterdPassword(e.target.value);
              setIsPasswordEmpty(false);
            }}
            value={enterdPassword}
          >
            Password
          </Input>

          {isPasswordEmpty && (
            <p id="passwprd-error" className="text-red-500">
              please enter a valid password
            </p>
          )}
        </div>

        <div className="mt-8">
          <Button primary rounded>
            Sign In
          </Button>
        </div>
      </form>

      <GoogleSignUp login />
    </div>
  );
}

export default LoginForm;
