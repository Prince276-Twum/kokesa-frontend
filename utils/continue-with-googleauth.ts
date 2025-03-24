import { toast } from "react-toastify";

export async function continueWithGoogleAuth(): Promise<void> {
  const userType: string = "business";
  try {
    const redirectUri: string =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_REDIRECT_URL || ""
        : "http://localhost:3000/auth/google";

    const initResponse = await fetch("/api/initiate-google-auth/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_type: userType,
      }),
    });

    if (!initResponse.ok) {
      throw new Error("Failed to initialize Google auth");
    }

    const googleAuthResponse = await fetch(
      `/api/o/google-oauth2/?redirect_uri=${encodeURIComponent(redirectUri)}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const authData = await googleAuthResponse.json();

    if (authData.authorization_url) {
      window.location.replace(authData.authorization_url);
    } else {
      toast.error("Failed to get authorization URL");
    }
  } catch (error) {
    console.error("Google Auth Error:", error);
    toast.error("Something went wrong");
  }
}
