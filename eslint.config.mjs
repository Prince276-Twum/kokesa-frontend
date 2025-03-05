import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react/no-unescaped-entities": "off", // Disable the react/no-unescaped-entities rule
      "@typescript-eslint/no-explicit-any": "off", // Disable the @typescript-eslint/no-explicit-any rule
      // "@typescript-eslint/no-unused-vars": "off", // Disable the @typescript-eslint/no-unused-vars rule
      // "@typescript-eslint/no-empty-object-type": "off", // Disable the @typescript-eslint/no-empty-object-type rule
      // "@react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
