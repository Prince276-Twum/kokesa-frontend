import {
  useRetrieveBusinessQuery,
  useSetupBusinessMutation,
} from "@/store/features/businessApiSetupSlice";
import {
  setBusinessDetail,
  setCurrentStep,
} from "@/store/features/businessSetupSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Country } from "react-phone-number-input";
import { toast } from "react-toastify";

interface UseBusinessSetupReturnType {
  businessName: string;
  setBusinessName: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  phoneValue: string | undefined;
  setPhoneValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  defaultCountry: Country | undefined;
  isButtonDisabled: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isBusinessLoading: boolean;
  agreedToTerms: boolean;
  setAgreedToTerms: React.Dispatch<React.SetStateAction<boolean>>;
}

const useBusinessSetup = (): UseBusinessSetupReturnType => {
  const [setupBusiness, { isLoading: isBusinessLoading }] =
    useSetupBusinessMutation();
  const router = useRouter();
  const { currentStep, businessInfo } = useAppSelector(
    (store) => store.businessSetup
  );
  const [businessName, setBusinessName] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneValue, setPhoneValue] = useState<string>();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [defaultCountry, setDefaultCountry] = useState<Country | undefined>(
    "GH"
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useRetrieveBusinessQuery(undefined, {
    skip: currentStep == 1,
  });

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await fetch("http://ip-api.com/json/");
        const data = await response.json();
        setDefaultCountry(data.country_code);
      } catch (error) {}
    };

    fetchCountryCode();
  }, []);

  const validateForm = () => {
    const isBusinessNameValid = businessName.trim().length > 0;
    const isUserNameValid = userName.trim().length > 0;
    const isPhoneValid = phoneValue && phoneValue.length > 0;
    const isTermsAccepted = agreedToTerms;

    setIsButtonDisabled(
      !(
        isBusinessNameValid &&
        isUserNameValid &&
        isPhoneValid &&
        isTermsAccepted
      )
    );
  };

  useEffect(() => {
    validateForm();
  }, [businessName, userName, phoneValue, agreedToTerms]);

  useEffect(() => {
    setBusinessName(businessInfo.businessName);
    setPhoneValue(businessInfo.phoneNumber);
    setUserName(businessInfo.userName);
  }, [businessInfo]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !businessName.trim() ||
      !userName.trim() ||
      !phoneValue ||
      !agreedToTerms
    ) {
      if (!agreedToTerms) {
        toast.error("Please accept the terms and conditions to continue");
      }
      return;
    }

    setupBusiness({
      businessName,
      userName,
      phoneNumber: phoneValue,
      currentStep: 1,
      termsAccepted: agreedToTerms,
    })
      .unwrap()
      .then(() => {
        dispatch(
          setBusinessDetail({
            businessName,
            userName,
            phoneNumber: phoneValue,
          })
        );
        dispatch(setCurrentStep(2));
        router.push("category");
      })
      .catch((error) => {
        console.log(error);
        if (error.data?.phone_number) {
          toast.error(`Phone number error: ${error.data.phone_number}`);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      });
  };

  return {
    businessName,
    setBusinessName,
    userName,
    setUserName,
    phoneValue,
    setPhoneValue,
    defaultCountry,
    isButtonDisabled,
    onSubmit,
    isBusinessLoading,
    agreedToTerms,
    setAgreedToTerms,
  };
};

export default useBusinessSetup;
