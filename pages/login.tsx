import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
    const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  async function signIn() {
    console.log("Attempting logging in as " + username);
    const loginJSON = {
        username: username,
        password: password
    }
    const response = await fetch('http://localhost:3001/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginJSON)
    });
    if(response.status == 200){
        const token = await response.json();
        console.log(token);
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        router.push("/");
    }else{
        setLoginError(true);
    }
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      <div className="mb-4">
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="username"
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
      </div>
      <div className="mb-6">
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Password
        </label>
        <input
          className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
          id="password"
          type="password"
          placeholder="******************"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <p className="text-red text-xs italic" hidden={!loginError}>Error logging in, please try again</p>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue hover:bg-blue-dark font-bold py-2 px-4 rounded"
          type="button"
          onClick={signIn}
        >
          Sign In
        </button>
        <a
          className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker"
          href="/signup"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}
