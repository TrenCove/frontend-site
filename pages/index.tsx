import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SearchTable from "@/components/SearchTable";
import { item } from "@/interfaces/interfaces";

export default function Home() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [items, setItems] = useState<item[]>();

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
    fetch("http://localhost:3002/getAllItems", {
      method: "GET",
    }).then(async (response) => {
      console.log("Fetching");
      if (response.status == 200) {
        setItems(await response.json());
      }
    });
  },[]);

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
                <table className="min-w-full">
                  <thead className="bg-white border-b">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Item Name
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Auction Type
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Ending Time
                      </th>
                    </tr>
                  </thead>
                  <SearchTable items={items} />
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
