import { useState } from "react";
import { useRouter } from "next/router";
export default function Receipt()
{
    const router = useRouter();
    async function receipt()
    {
    const response = await fetch("http://localhost:3004/receipt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    });
        if (response.status == 200) {
        const token = await response.json();
        console.log(token);
        router.push("/");
    }
}

return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      <div className="mb-4">
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Receipts
        </label>
      </div>
      <div className = "mb-6">
            <label className = "block text-grey-darker text-sm font-bold mb-2">
            Date: March 22nd 2023
            </label>
            <label className = "block text-grey-darker text-sm font-bold mb-2">
            Event: Grand Auction
            </label>
            <label className = "block text-grey-darker text-sm font-bold mb-2">
            Item Name: Vase
            </label>
            <label className = "block text-grey-darker text-sm font-bold mb-2">
            Item ID: vase_01
            </label>
            <label className = "block text-grey-darker text-sm font-bold mb-2">
            Quantity: 1
            </label>
            <label className = "block text-grey-darker text-sm font-bold mb-2">
            Total Price: $ 4500
            </label>
            <label className = "block text-grey-darker text-sm font-bold mb-2">
            Credit/Debit card number: 5566 6674 **** 
            </label>
      </div>
    </div>

  );
}