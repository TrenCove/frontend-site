export interface Item {
    item_id: number,
    item_name: string,
    description: string,
    top_bidder: string,
    price: number,
    shipping_cost: number,
    active: string,
    auction_type: 'F' | 'D',
    end_time: string
}

export interface ReceivedWebsocketData {
    action: string,
    username: string,
    item: Item
}

export interface Name {
    firstName: string,
    lastName: string
}

export interface Address {
    firstAddressLine: string,
    secondAddressLine?: string,
    city: string,
    postalCode: string,
    province: string
}

export interface UserInfo {
    name: Name,
    address: Address
}

export interface Receipt {
    username: string,
    address: string,
    name: string,
    cost: number
}