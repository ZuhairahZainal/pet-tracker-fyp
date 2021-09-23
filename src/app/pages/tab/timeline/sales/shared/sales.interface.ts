export class NewProduct {
  productId: string;
  productName: string;
  productCategory: string;
  productPrice: number;
  productDescription: string;
  productImage: null;
}

export interface CartItem {
  productId: string;
  productName: string;
  productCategory: string;
  productPrice: number;
  productDescription: string;
  productImage: null;
}
