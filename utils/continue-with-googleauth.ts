import { toast } from "react-toastify";

export async function continueWithGoogleAuth() {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_HOST
    }/api/o/google-oauth2/?redirect_uri=${
      process.env.NODE_ENV == "production"
        ? process.env.NEXT_PUBLIC_REDIRECT_URL
        : "http://localhost:3000/auth/google"
    }`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",

      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json();
    console.log(data);

    if (res.status == 200 && typeof window !== "undefined") {
      window.location.replace(data.authorization_url);
    } else {
      toast.error("something went wrong");
    }
  } catch {
    toast.error("something went wrong");
  }
}
