export interface ProductDetail {
  cartId: string,
  cartProductCategory: string,
  cartProductDescription: string,
  cartProductId: string,
  cartProductImage: string,
  cartProductName: string,
  cartProductPrice: number,
  userId: string,
}

export interface Orders {
  date: string,
  time: number,
  orderId: any,
}
