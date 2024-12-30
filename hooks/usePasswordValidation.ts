import { useMemo } from "react";

const usePasswordValidation = (password: string) => {
  // Validate password and create an array of validation messages with conditions
  const { messages, validations } = useMemo(() => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&#]/.test(password),
    };

    const messages = [
      { condition: validations.length, message: "At least 8 characters." },
      {
        condition: validations.uppercase,
        message: "At least one uppercase letter.",
      },
      {
        condition: validations.lowercase,
        message: "At least one lowercase letter.",
      },
      { condition: validations.number, message: "At least one number." },
      {
        condition: validations.special,
        message: "At least one special character.",
      },
    ];

    return { messages, validations };
  }, [password]);

  // Determine overall validity (all conditions must be true)
  const isValid = Object.values(validations).every(Boolean);

  return {
    feedbackMessages: messages,
    isValid,
    validations,
  };
};

export default usePasswordValidation;
