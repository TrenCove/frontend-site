import { item } from "@/interfaces/interfaces"

function renderRow(item: item){
    return(
    <tr key={item.item_id} className="bg-gray-100 border-b">
    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
      {item.item_name}
    </td>
    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
      {item.auction_type == 'F' ? 'Forward' : 'Dutch'}
    </td>
    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
      {item.price}
    </td>
    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
      {item.auction_type == 'F' ? item.end_time : 'N/A'}
    </td>
    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
      <button><a href={`/item/${item.item_id}`} >View Item</a></button>
    </td>
  </tr>)
}


export default function SearchTable ({items}: {items:item[]|undefined}){
    if(items){
    return (
        <tbody>
            {items.map((item)=>{
                return renderRow(item);
            })}
      </tbody>
    )
        }else{
            return <div></div>
        }
}