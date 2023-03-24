import Payment from "@/components/Payment";
import { Item, ReceivedWebsocketData } from "@/interfaces/interfaces";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ItemPage() {
  const router = useRouter();
  const id = router.query.id as unknown as number;
  const [auth, setAuth] = useState(false);
  const [item, setItem] = useState<Item>();
  const [bid, setBid] = useState("");
  const [inputError, setInputError] = useState(false);
  const [itemPaid, setItemPaid] = useState(false);
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
      const request = {
        bidAmount: bid,
        username: username,
        id: item?.item_id,
      };
      fetch("http://localhost:3005/placeBid", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }).then(async (response) => {
        console.log(response);
        router.reload();
      });
    }
  }

  function buyNow() {
    const request = {
      bidder: username,
      id: item?.item_id,
    };
    fetch("http://localhost:3005/buyItem", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }).then(async (response) => {
      console.log(response);
    });
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
          await response.json();
          setItemPaid(true);
        } catch (error) {
          setItemPaid(false);
        }
      }
    });
  }

  function getItem(id: number) {
    fetch("http://localhost:3002/searchItemID/" + id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      console.log("Fetching item " + id);
      if (response.status == 200) {
        try {
          setItem(await response.json());
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
        getItem(id);
        getReceipt(id);
      }
    } else {
      router.push("/");
    }
  }, [router.isReady]);

  if (auth == true && item != undefined && wsInstance != undefined) {
    wsInstance.onopen = () => {
      const subscribeRequest = {
        action: "subscribe",
        username: username,
        item: id,
      };
      if (item.active == "true") {
        wsInstance.send(JSON.stringify(subscribeRequest));
      }
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
      const receivedMessage = JSON.parse(message.data) as ReceivedWebsocketData;
      console.log("Received message from server: ");
      console.log(receivedMessage);
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
        <button
          className="font-bold py-2 px-4 rounded-full bg-green-500"
          type="button"
        >
          <a href="/">Home</a>
        </button>
        <div>Item ID: {item.item_id}</div>
        <div>
          Auction Type: {item.auction_type == "D" ? "Dutch" : "Forward"}
        </div>
        <div>Description: {item.description}</div>
        <div>
          Ending Time:{" "}
          {item.auction_type == "D"
            ? "N/A"
            : new Date(+item.end_time).toString()}
        </div>
        <div>Price: ${item.price}</div>
        <div>Shipping Cost: ${item.shipping_cost}</div>
        <div hidden={item.auction_type == "D"}>
          Top Bidder: {item.top_bidder}
        </div>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="bid"
          type="number"
          placeholder="$$$"
          onChange={(e) => setBid(e.target.value)}
          hidden={item.active != "true" || item.auction_type == "D"}
        ></input>
        <div hidden={!inputError}>Error, please try again</div>
        <div hidden={username != item.top_bidder || item.active == "true"}>
          You've won the bid
        </div>
        <button
          className="font-bold py-2 px-4 rounded-full bg-green-500"
          type="button"
          onClick={sendBid}
          hidden={item.active != "true" || item.auction_type == "D"}
        >
          Bid
        </button>
        <button
          className="font-bold py-2 px-4 rounded-full bg-green-500"
          type="button"
          onClick={buyNow}
          hidden={item.active == "false" || item.auction_type == "F"}
        >
          Buy Now
        </button>
        <div hidden={item.active == "true"}>This auction has ended</div>
        <div
          hidden={
            username != item.top_bidder ||
            item.active == "true" ||
            itemPaid == true
          }
        >
          <Payment
            item={item}
            username={username as string}
            token={token as string}
          />
        </div>
        <button
          className="font-bold py-2 px-4 rounded-full bg-green-500"
          type="button"
          hidden={itemPaid == false || item.top_bidder != username}
        >
          <a href={`/receipt/${id}`}>View Receipt</a>
        </button>
      </div>
    );
  }
}
