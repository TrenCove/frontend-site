import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Item, UserInfo } from "@/interfaces/interfaces";

export default function Payment({ item, username, token, }: { item: Item; username: string, token: string }) {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [user, setUser] = useState<UserInfo>();
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [code, setCode] = useState("");
  const [expedited, setExpedited] = useState(false);
  const [pay, setPayOption] = useState("");

  function handleCheck() {
    setExpedited(!expedited);
    console.log(expedited);
  }

  function sendPayment(){
    const paymentRequest = {
      item_id: item.item_id,
      pay: pay,
      item_receipt: {
        username: username,
        address: user?.address,
        name: user?.name,
        cost: expedited ? Math.round((+item.price + 5) * 100) / 100 : item.price,
      },
    }

    fetch("http://localhost:3004/submitPayment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequest),
    }).then(async (response) => {
      if(response.status == 200){
        router.push("/receipt/"+item.item_id);
      }
    });
  }

  function getUserInfo(){
    fetch("http://localhost:3001/getUserInfo/" , {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      console.log("Fetching user info ");
      if (response.status == 200) {
        setUser(await response.json());
      }
    });
  }

  useEffect(() => {
    if (router.isReady) {
      getUserInfo();
  }
  }, [router.isReady]);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      <div className="mb-4">
      <label className="block text-grey-darker text-sm font-bold mb-2">
          Card Type
        </label>
        <input 
          type = "radio" 
          value = "Visa"
          name = "r1"
          onChange={(e) => setPayOption(e.target.value)}
          />
        <label>Visa</label>
        <input
         type = "radio" 
         value = "MasterCard"
         name = "r1"
         onChange={(e) => setPayOption(e.target.value)}
         />
        <label>MasterCard</label>
        <input 
          type = "radio" 
          value = "Amex"
          name = "r1"
          onChange={(e) => setPayOption(e.target.value)}
          />
        <label>Amex</label>

        <label className="block text-grey-darker text-sm font-bold mb-2">
          Card #
        </label>
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-grey-darker"
          id="cardNumber"
          type="text"
          placeholder="Card Number"
          onChange={(e) => setCardNumber(e.target.value)}
        ></input>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Name on Card
        </label>
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-grey-darker"
          id="cardName"
          type="text"
          placeholder="Name on Card"
          onChange={(e) => setCardName(e.target.value)}
        ></input>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Expiry Date
        </label>
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-grey-darker"
          id="expiry"
          type="text"
          placeholder="Expiry Date"
          onChange={(e) => setExpiry(e.target.value)}
        ></input>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Security Code
        </label>
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-grey-darker"
          id="code"
          type="text"
          placeholder="Security Code"
          onChange={(e) => setCode(e.target.value)}
        ></input>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Expedited Shipping? +$5
        </label>
        <input
          id="code"
          type="checkbox"
          checked = {expedited}
          onChange={handleCheck}
        ></input>
      </div>
      <label className="block text-grey-darker text-sm font-bold mb-2">
          Total Cost: ${expedited ? Math.round((+item.price + 5) * 100) / 100 : item.price}
        </label>
      <div className="flex items-center justify-between">
        <button
          className="font-bold py-2 px-4 rounded-full bg-green-500"
          type="button"
          onClick={sendPayment}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
