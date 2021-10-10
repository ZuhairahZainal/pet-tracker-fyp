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
  getTime: number,
  localeDate: string,
  localeTime: string,
  orderId: string,
}
