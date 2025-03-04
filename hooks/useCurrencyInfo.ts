import { useState, useEffect } from "react";
import countries from "world-countries";
import currencySymbolMap from "currency-symbol-map";
import { useAppSelector } from "@/store/hooks";

interface CountryInfo {
  currencySymbol: string;
  currencyCode: string | undefined;
  countryCode: string | undefined;
}

const getCountryInfo = (countryName: string): CountryInfo => {
  const country = countries.find((c) => c.name.common === countryName);

  if (!country)
    return {
      currencySymbol: "$",
      currencyCode: undefined,
      countryCode: undefined,
    };

  const currencyCode = Object.keys(country.currencies)[0]; // Get currency code
  const currencySymbol = currencySymbolMap(currencyCode) || "$"; // Get symbol

  return {
    currencySymbol, // Return the symbol directly
    currencyCode, // Store currency code (e.g., "USD", "EUR")
    countryCode: country.cca2, // Include the country code
  };
};

const useCurrencyInfo = () => {
  const { businessAddress } = useAppSelector((store) => store.businessSetup);

  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [currencyCode, setCurrencyCode] = useState<string | undefined>(
    undefined
  );
  const [countryCode, setCountryCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (businessAddress) {
      const { currencySymbol, currencyCode, countryCode } = getCountryInfo(
        businessAddress.country
      );
      setCurrencySymbol(currencySymbol);
      setCurrencyCode(currencyCode);
      setCountryCode(countryCode);
    }
  }, [businessAddress]);

  return { currencySymbol, currencyCode, countryCode };
};

export default useCurrencyInfo;

// import { useState, useEffect } from "react";
// import countries from "world-countries";
// import currencySymbolMap from "currency-symbol-map";

// interface CountryInfo {
//   currencySymbol: string;
//   currencyCode: string | undefined;
//   countryCode: string | undefined; // Added countryCode here
// }

// const isCurrencySymbolUnique = (symbol: string): boolean => {
//   // Check if the symbol is unique across all countries
//   const countriesUsingSymbol = countries.filter((country) => {
//     const currencyCode = Object.keys(country.currencies)[0];
//     const currencySymbol = currencySymbolMap(currencyCode);
//     return currencySymbol === symbol;
//   });

//   return countriesUsingSymbol.length === 1; // Only one country uses this symbol
// };

// const getCountryInfo = (countryName: string): CountryInfo => {
//   const country = countries.find((c) => c.name.common === countryName);

//   if (!country)
//     return {
//       currencySymbol: "$",
//       currencyCode: undefined,
//       countryCode: undefined,
//     };

//   const currencyCode = Object.keys(country.currencies)[0]; // Get currency code
//   const currencySymbol = currencySymbolMap(currencyCode) || "$"; // Get symbol

//   // Check if the symbol is unique, if not use the country code as the symbol
//   const finalSymbol = isCurrencySymbolUnique(currencySymbol)
//     ? currencySymbol
//     : country.cca2;

//   return {
//     currencySymbol: finalSymbol, // Use country code if symbol isn't unique
//     currencyCode, // Store currency code (e.g., "USD", "EUR")
//     countryCode: country.cca2, // Include the country code
//   };
// };

// const useCurrencyInfo = () => {
//   const [currencySymbol, setCurrencySymbol] = useState("$");
//   const [currencyCode, setCurrencyCode] = useState<string | undefined>(
//     undefined
//   );
//   const [countryCode, setCountryCode] = useState<string | undefined>(undefined); // Added state for countryCode

//   useEffect(() => {
//     const savedAddress = localStorage.getItem("businessAddress");
//     if (savedAddress) {
//       const parsedAddress = JSON.parse(savedAddress);
//       const { currencySymbol, currencyCode, countryCode } = getCountryInfo(
//         parsedAddress.country
//       );
//       setCurrencySymbol(currencySymbol);
//       setCurrencyCode(currencyCode);
//       setCountryCode(countryCode); // Set the countryCode
//     }
//   }, []);

//   return { currencySymbol, currencyCode, countryCode };
// };

// export default useCurrencyInfo;

// import { useState, useEffect } from "react";
// import countries from "world-countries";
// import currencySymbolMap from "currency-symbol-map";

// interface CountryInfo {
//   currencySymbol: string;
//   code: string | undefined;
// }

// const getCountryInfo = (countryName: string): CountryInfo => {
//   const country = countries.find((c) => c.name.common === countryName);

//   if (!country) return { currencySymbol: "$", code: undefined };

//   const currencyCode = Object.keys(country.currencies)[0]; // Get currency code
//   return {
//     currencySymbol: currencySymbolMap(currencyCode) || "$", // Get symbol
//     code: country.cca2, // Get country code (e.g., "US", "GH", "NG")
//   };
// };

// const useCurrencyInfo = () => {
//   const [currencySymbol, setCurrencySymbol] = useState("$");
//   const [countryCode, setCountryCode] = useState<string | undefined>(undefined);

//   useEffect(() => {
//     const savedAddress = localStorage.getItem("businessAddress");
//     if (savedAddress) {
//       const parsedAddress = JSON.parse(savedAddress);
//       const { currencySymbol, code } = getCountryInfo(parsedAddress.country);
//       setCurrencySymbol(currencySymbol);
//       setCountryCode(code);
//       console.log("Currency Symbol: ", currencySymbol);
//       console.log("Country Code: ", code);
//     }
//   }, []);

//   return { currencySymbol, countryCode };
// };

// export default useCurrencyInfo;
