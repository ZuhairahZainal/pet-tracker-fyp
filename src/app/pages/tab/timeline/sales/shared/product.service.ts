import { Injectable } from '@angular/core';
import { NewProduct } from '../shared/sales';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productListRef: AngularFireList<any>;
  productRef: AngularFireObject<any>;

  createproduct: NewProduct = new NewProduct();

  constructor(private db: AngularFireDatabase) { }

    // Create
    createProduct(npdt: NewProduct) {

      this.productListRef = this.db.list('/newProduct');

      return this.productListRef.push({

        productName: npdt.productName,
        productCategory: npdt.productCategory,
        productPrice: npdt.productPrice,
        productDescription: npdt.productDescription,
        productImage: npdt.productImage
      })
    }

    // Get Single
    getProduct(productId: string) {
      this.productRef = this.db.object('/newProduct/' + productId);
      return this.productRef;
    }

    // Get List
    getProductList() {
      this.productListRef = this.db.list('/newProduct');
      return this.productListRef;
    }

    // Update
    updateProduct(productId, npdt: NewProduct) {
      return this.productRef.update({
        productName: npdt.productName,
        productCategory: npdt.productCategory,
        productPrice: npdt.productPrice,
        productDescription: npdt.productDescription,
        productImage: npdt.productImage
      })
    }

    // Delete
    deleteProduct(productId: string) {
      this.productRef = this.db.object('/newProduct/' + productId);
      this.productRef.remove();
    }
}
