import { useEffect, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      return /android|iphone|ipad|mobile/i.test(userAgent);
    };

    setIsMobile(checkIsMobile());
  }, []);

  return isMobile;
};

export default useIsMobile;
