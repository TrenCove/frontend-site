import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SearchTable from "@/components/SearchTable";
import { Item } from "@/interfaces/interfaces";

export default function Home() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [items, setItems] = useState<Item[]>();
  const token = getAccessToken();

  function logout() {
    localStorage.clear();
    setAuth(false);
    router.push("/login");
  }

  function addItemtoDb(item: Item) {
    fetch("http://localhost:3002/itemAdd", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }).then(async (response) => {
      if (response.status == 200) {
        console.log("Adding item to db ");
        getAllItems();
      }
    });
  }

  function getAllItems() {
    fetch("http://localhost:3002/getAllItems", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      console.log("Fetching");
      if (response.status == 200) {
        setItems(await response.json());
      }
    });
  }

  function addTestForwardAuctionItem() {
    const testItem: Item = {
      item_id: 1,
      item_name: "Test item " + Math.floor(Math.random() * 100),
      description: "This is a description",
      top_bidder: "",
      price: Math.floor(Math.random() * 100),
      shipping_cost: Math.floor(Math.random() * 100),
      active: "true",
      auction_type: "F",
      end_time: `${Date.now() + 5 * 60000}`,
    };
    addItemtoDb(testItem);
  }

  function addTestDutchAuctionItem() {
    const testItem: Item = {
      item_id: 1,
      item_name: "Test item " + Math.floor(Math.random() * 100),
      description: "This is a description",
      top_bidder: "",
      price: Math.floor(Math.random() * 100),
      shipping_cost: Math.floor(Math.random() * 100),
      active: "true",
      auction_type: "D",
      end_time: "",
    };
    addItemtoDb(testItem);
  }

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

  useEffect(() => {
    if (token != undefined) {
      isAuth(token);
      getAllItems();
    } else {
      router.push("/login");
    }
  }, []);

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
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
              <SearchTable items={items}></SearchTable>
                <button
                  className="font-bold py-2 px-4 rounded-full bg-green-500"
                  type="button"
                  onClick={addTestForwardAuctionItem}
                >
                  Add test forward auction item
                </button>
                <button
                  className="font-bold py-2 px-4 rounded-full bg-green-500"
                  type="button"
                  onClick={addTestDutchAuctionItem}
                >
                  Add test dutch auction item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
