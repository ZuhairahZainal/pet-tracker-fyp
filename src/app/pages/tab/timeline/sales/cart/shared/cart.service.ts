import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from '../../shared/product.service';
import { NewProduct } from '../../shared/sales';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  data: NewProduct[] = [];

  private cart = [];
  private cartItemCount = new BehaviorSubject(0);

  constructor(private productService: ProductService) {
    this.fetchProducts();
    let productRes = this.productService.getProductList();
    productRes.snapshotChanges().subscribe(res => {
      this.data = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.data.push(a as NewProduct);
      })
    })
  }

  fetchProducts() {
    this.productService.getProductList().valueChanges().subscribe(res => {
      console.log(res);
    })
  }

  getProducts() {
    return this.data;
  }

  getCart() {
    return this.cart;
  }

  getCartItemCount() {
    return this.cartItemCount;
  }

  addProduct(product) {
    let added = false;
    for (let p of this.cart) {
      if (p.id === product.id) {
        p.amount += 1;
        added = true;
        break;
      }
    }
    if (!added) {
      product.amount = 1;
      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);
  }

  removeProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index, 1);
      }
    }
  }
}
