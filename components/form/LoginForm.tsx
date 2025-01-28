"use client";
import useEmailValidation from "@/hooks/useEmailValidation";
import { useLoginMutation } from "@/store/features/authApiSlice";
import { setAuth } from "@/store/features/authSlice";
import { useAppDispatch } from "@/store/hooks";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import Button from "../UI/Button";
import Input from "../UI/Input";
import GoogleSignUp from "../common/GoogleSignUp";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const { email, emailError, handleEmailChange, checkEmailValidity } =
    useEmailValidation();
  const [password, setPassword] = useState("");
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const isEmailValid = checkEmailValidity();
    const isPasswordValid = password !== "";

    if (isEmailValid && isPasswordValid) {
      login({ email, password })
        .unwrap()
        .then(() => {
          dispatch(setAuth());
          router.push("/dashboard");
        })
        .catch(() => {
          toast.error("failed to sign in");
        });
    } else {
      // Update error states
      if (!isEmailValid) checkEmailValidity(); // Re-run to trigger email error display
      if (!isPasswordValid) setIsPasswordEmpty(true);
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
          ></Input>

          {emailError && (
            <p id="email-error" className="text-red-500 text-sm md:text-base">
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
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
              setIsPasswordEmpty(false);
            }}
            value={password}
          ></Input>

          {isPasswordEmpty && (
            <p
              id="passwprd-error"
              className="text-red-500 text-sm md:text-base"
            >
              please enter a valid password
            </p>
          )}
        </div>

        <div className="mt-8">
          <Button
            el="button"
            primary
            rounded
            loading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </div>

        <Link
          className="text-left block py-2  font-semibold text-green-500"
          href=""
        >
          Forgot password?
        </Link>
      </form>

      <GoogleSignUp login />
    </div>
  );
}

export default LoginForm;
