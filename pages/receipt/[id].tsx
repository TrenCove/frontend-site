import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Address, Name, Receipt } from "@/interfaces/interfaces";

export default function ReceiptPage() {
  const router = useRouter();
  const id = router.query.id as unknown as number;
  const [receipt, setReceipt] = useState<Receipt>();
  const [auth, setAuth] = useState(false);
  const token = getAccessToken();

  function getAccessToken() {
    if (typeof window !== "undefined") return localStorage.getItem("token");
  }

  function isAuth(token: string | undefined | null) {
    if (token != undefined) {
      fetch("http://localhost:3001/testAuth", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        console.log("Checking auth on server");
        if (response.status == 200) {
          console.log("Authed");
          setAuth(true);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          setAuth(false);
          router.push("/login");
        }
      });
    }
  }

  function getReceipt(id: number) {
    fetch("http://localhost:3004/searchPaid/" + id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.status == 200) {
        try {
          const receipt = await response.json();
          console.log(JSON.parse(receipt.item_recepit));
          setReceipt(JSON.parse(receipt.item_recepit));
        } catch (error) {
          router.push("/");
        }
      }
    });
  }

  useEffect(() => {
    if (token != undefined) {
      isAuth(token);
      if (router.isReady) {
        getReceipt(id);
      }
    } else {
      router.push("/");
    }
  }, [router.isReady]);

  if (auth == true && receipt != undefined) {
    try {
    const name = JSON.parse(receipt.name) as Name;
    const address = JSON.parse(receipt.address) as Address;
    return (
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div className="mb-4">
          <label className="block text-grey-darker text-sm font-bold mb-2">
            Receipt
          </label>
        </div>
        <div className="mb-6">
          <label className="block text-grey-darker text-sm font-bold mb-2">
            Item id : {id}
          </label>
          <label className="block text-grey-darker text-sm font-bold mb-2">
            Name: {name.firstName + " " + name.lastName}
          </label>
          <label className="block text-grey-darker text-sm font-bold mb-2">
            First Address Line: {address.firstAddressLine}
          </label>
          <label className="block text-grey-darker text-sm font-bold mb-2">
            Second Address Line: {address.secondAddressLine}
          </label>
          <label className="block text-grey-darker text-sm font-bold mb-2">
            City: {address.city}
          </label>
          <label className="block text-grey-darker text-sm font-bold mb-2">
            Postal Code: {address.postalCode}
          </label>
          <label className="block text-grey-darker text-sm font-bold mb-2">
            Province: {address.province}
          </label>
          <label className="block text-grey-darker text-sm font-bold mb-2">
            Total Paid: $ {receipt.cost}
          </label>
          <label className="block text-grey-darker text-sm font-bold mb-2">
            Your order will ship in: {Math.floor(Math.random() * 20)} days
          </label>
          <button
            className="font-bold py-2 px-4 rounded-full bg-green-500"
            type="button"
          >
            <a href="/">Home</a>
          </button>
        </div>
      </div>
    );
    }catch(error){
        router.push("/");
    }
  }
}
