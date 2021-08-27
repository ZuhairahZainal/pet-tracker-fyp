import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from '../shared/product.service';
import { NewProduct } from '../shared/sales';
import { CartService } from './shared/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cart = [];
  Products: NewProduct[] = [];
  cartItemCount: BehaviorSubject<number>;

  @ViewChild('cart', {static: false, read: ElementRef})fab: ElementRef;

  constructor(private cartService: CartService,
              private modalCtrl: ModalController,
              private productService: ProductService) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();

    this.fetchProducts();
    let productRes = this.productService.getProductList();
    productRes.snapshotChanges().subscribe(res => {
      this.Products = [];
      this.Products = this.cartService.getProducts();
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.Products.push(a as NewProduct);
      })
    })

    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  fetchProducts() {
    this.productService.getProductList().valueChanges().subscribe(res => {
      console.log(res)
    })
  }

  removeCartItem(product) {
    this.cartService.removeProduct(product);
  }

  getTotal() {
    return this.cart.reduce((i, j) => i + j.productPrice, 0);
  }
}
