import { toast } from "react-toastify";

export async function continueWithGoogleAuth(): Promise<void> {
  try {
    const redirectUri: string = 
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_REDIRECT_URL || ""
        : "http://localhost:3000/auth/google";

    const url: string = `/api/o/google-oauth2/?redirect_uri=${encodeURIComponent(redirectUri)}`;

    const res: Response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    interface AuthorizationResponse {
      authorization_url: string;
    }

    const data: AuthorizationResponse = await res.json();

    if (res.status === 200 && typeof window !== "undefined") {
      window.location.replace(data.authorization_url);
    } else {
      toast.error("Something went wrong");
    }
  } catch (error) {
    console.error("Google Auth Error:", error);
    toast.error("Something went wrong");
  }
}