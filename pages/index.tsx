import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);

  function logout() {
    localStorage.clear();
    setAuth(false);
  }

  useEffect(() => {
    const getAccessToken = () => {
      if (typeof window !== "undefined") return localStorage.getItem("token");
    };
    const token = getAccessToken();
    if (token != undefined) {
      setAuth(true);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setAuth(false);
      router.push("/login");
    }
  });
  if (auth == true) {
    console.log("authed");
    return (
      <div>
        <h1 className="text-3xl font-bold underline">Search Page</h1>
        <button
          className="font-bold py-2 px-4 rounded-full bg-green-500"
          type="button"
          onClick={logout}
        >
          Sign out
        </button>
      </div>
    );
  }
}
