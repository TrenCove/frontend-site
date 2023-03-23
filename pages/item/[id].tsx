import { item, receivedWebsocketData } from "@/interfaces/interfaces";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Item() {
  const router = useRouter();
  const id = router.query.id as unknown as number; //jank af
  const [auth, setAuth] = useState(false);
  const [item, setItem] = useState<item>();
  const [bid, setBid] = useState("");
  const [inputError, setInputError] = useState(false);
  const token = getAccessToken();
  const username = getUsername();
  const isBrowser = typeof window !== "undefined";

  const wsInstance = isBrowser
    ? new WebSocket("ws://localhost:3003")
    : undefined;

  function getAccessToken() {
    if (typeof window !== "undefined") return localStorage.getItem("token");
  }

  function getUsername() {
    if (typeof window !== "undefined") return localStorage.getItem("username");
  }

  function sendBid() {
    if (isNaN(+bid) || +bid <= +item!.price) {
      setInputError(true);
    } else {
        setInputError(false);
      //fetch bid service here
      const newItem = {
        item: { ...item, price: bid, top_bidder: username },
      };
      fetch("http://localhost:3003/publish", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      }).then(async (response) => {
        console.log(response);
      });
    }
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

  useEffect(() => {
    if (token != undefined) {
      isAuth(token);
      if (router.isReady) {
        fetch("http://localhost:3002/searchItemID/" + id, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then(async (response) => {
          console.log("Fetching item " + id);
          if (response.status == 200) {
            setItem(await response.json());
          }
        });
      }
    } else {
      router.push("/login");
    }
  }, [router.isReady]);

  if (auth == true && item != undefined && wsInstance != undefined) {
    wsInstance.onopen = () => {
      const subscribeRequest = {
        action: "subscribe",
        username: username,
        item: id,
      };
      wsInstance.send(JSON.stringify(subscribeRequest));
    };

    wsInstance.onclose = () => {
      const unSubscribeRequest = {
        action: "unsubscribe",
        username: localStorage.getItem("username"),
        item: id,
      };
      wsInstance.send(JSON.stringify(unSubscribeRequest));
    };

    wsInstance.onmessage = (message) => {
      const receivedMessage = JSON.parse(message.data) as receivedWebsocketData;
      console.log("Received message from server: ");
      console.log(receivedMessage)
      if (
        receivedMessage.action == "publish" &&
        username == receivedMessage.username &&
        receivedMessage.item.item_id == id
      ) {
        setItem(receivedMessage.item);
      }
    };

    return (
      <div>
        <div>Item ID: {item.item_id}</div>
        <div>Auction Type: {item.auction_type}</div>
        <div>Description: {item.description}</div>
        <div>Ending Time: {item.end_time}</div>
        <div>Price: {item.price}</div>
        <div>Shipping Cost: {item.shipping_cost}</div>
        <div>Current Top Bidder: {item.top_bidder}</div>
        <label className="block text-grey-darker text-sm font-bold mb-2">
          Bid:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="bid"
          type="number"
          placeholder="$$$"
          onChange={(e) => setBid(e.target.value)}
        ></input>
        <div hidden={!inputError}>Error, please try again</div>
        <button
          className="font-bold py-2 px-4 rounded-full bg-green-500"
          type="button"
          onClick={sendBid}
        >
          Bid
        </button>
      </div>
    );
  }
}
