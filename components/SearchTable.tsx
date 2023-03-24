import { Item } from "@/interfaces/interfaces";
import { useState } from "react";

function renderRow(item: Item) {
  return (
    <tr key={item.item_id} className="bg-gray-100 border-b">
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {item.item_name}
      </td>
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {item.auction_type == "F" ? "Forward" : "Dutch"}
      </td>
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        ${item.price}
      </td>
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {item.auction_type == "F" ? new Date(+item.end_time).toString() : "N/A"}
      </td>
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        <button>
          <a href={`/item/${item.item_id}`}>View Item</a>
        </button>
      </td>
    </tr>
  );
}

export default function SearchTable({ items }: { items: Item[] | undefined }) {
  const [search, setSearch] = useState("");

  function handleSearch(value: string) {
    setSearch(value);
  }

  if (items != undefined) {
    const rows = items.filter((item) => item.item_name.includes(search));
    return (
      <div>
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-grey-darker"
          id="search"
          type="text"
          placeholder="Search"
          onChange={(e) => handleSearch(e.target.value)}
        ></input>
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
          <tbody>
            {rows.map((item) => {
              return renderRow(item);
            })}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <tbody></tbody>;
  }
}
