export interface item {
    item_id: number,
    item_name: string,
    description: string,
    top_bidder: string,
    price: number,
    shipping_cost: number,
    active: boolean,
    auction_type: 'F' | 'D',
    end_time: string
}