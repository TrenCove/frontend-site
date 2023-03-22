import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstAddress, setFirstAddress] = useState("");
  const [secondAddress, setSecondAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [province, setProvince] = useState("");
  const [loginError, setLoginError] = useState(false);

  async function signUp() {
    console.log("Attempting signup as " + username);
    const signupJSON = {
      username: username,
      password: password,
      name: {
        firstName: firstName,
        lastName: lastName,
      },
      address: {
        firstAddressLine: firstAddress,
        secondAddressLine: secondAddress,
        city: city,
        postalCode: postalCode,
        province: province,
      },
    };
    const response = await fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupJSON),
    });
    if (response.status == 200) {
      const token = await response.json();
      console.log(token);
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      router.push("/");
    } else {
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="password"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          First Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="firstName"
          type="text"
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        ></input>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Last Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="lastName"
          type="text"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        ></input>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          First Address Line
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="firstAddressLine"
          type="text"
          placeholder="First Address Line"
          onChange={(e) => setFirstAddress(e.target.value)}
        ></input>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Second Address Line
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="secondAddressLine"
          type="text"
          placeholder="Second Address Line"
          onChange={(e) => setSecondAddress(e.target.value)}
        ></input>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          City
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="city"
          type="text"
          placeholder="City"
          onChange={(e) => setCity(e.target.value)}
        ></input>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Postal Code
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="postalCode"
          type="text"
          placeholder="Postal Code"
          onChange={(e) => setPostalCode(e.target.value)}
        ></input>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Province
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="province"
          type="text"
          placeholder="Province"
          onChange={(e) => setProvince(e.target.value)}
        ></input>
        <p className="text-red text-xs italic" hidden={!loginError}>
          Error, user already exists or please check all fields and try again
        </p>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue hover:bg-blue-dark font-bold py-2 px-4 rounded"
          type="button"
          onClick={signUp}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
