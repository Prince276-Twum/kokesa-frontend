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
    setIsButtonDisabled(
      !(isBusinessNameValid && isUserNameValid && isPhoneValid)
    );
  };

  useEffect(() => {
    validateForm();
  }, [businessName, userName, phoneValue]);

  useEffect(() => {
    setBusinessName(businessInfo.businessName);
    setPhoneValue(businessInfo.phoneNumber);
    setUserName(businessInfo.userName);
  }, [businessInfo]);

  // useEffect(() => {
  //   if (detail.businessName && detail.userName && detail.phoneNumber) {
  //     setBusinessName(detail.businessName);
  //     setUserName(detail.userName);
  //     setPhoneValue(detail.phoneNumber);
  //   } else {
  //     if (isLoading) return;
  //     if (isError) {
  //       // toast.error("Something went wrong");
  //     }
  //     if (data && Array.isArray(data) && data.length === 0) {
  //       // No business profile exists, clear fields
  //       setBusinessName("");
  //       setUserName("");
  //       setPhoneValue("");
  //     } else if (data) {
  //       const businessData = data[0];
  //       setBusinessName(businessData?.business_name);
  //       setUserName(businessData?.user_name);
  //       setPhoneValue(businessData?.phone_number);
  //     }
  //   }
  // }, [currentStep, isLoading, isError, data, detail]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isButtonDisabled) {
      setupBusiness({
        businessName,
        userName,
        phoneNumber: phoneValue,
        currentStep: 1,
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
          router.push("/business-setup/category");
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    }
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
  };
};

export default useBusinessSetup;
