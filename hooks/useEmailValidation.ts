import { useState } from "react";

function useEmailValidation() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError(""); // Clear error on valid input
  };

  const checkEmailValidity = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  return {
    email,
    setEmail,
    emailError,
    handleEmailChange,
    checkEmailValidity,
  };
}

export default useEmailValidation;
