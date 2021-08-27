import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from './cart/shared/cart.service';
import { ProductService } from './shared/product.service';
import { NewProduct } from './shared/sales';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {

  Products: NewProduct[] = [];

  public segment: string = "allproduct";

  @ViewChild('cart', {static: false, read: ElementRef})fab: ElementRef;

  constructor(private productService: ProductService, private cartService: CartService) {}

  //filter segment (incomplete)
  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }


  // ambil from firebase realtime database for display
  ngOnInit() {
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
  }

  //fetch data function to use in ng on initialise
  fetchProducts() {
    this.productService.getProductList().valueChanges().subscribe(res => {
      console.log(res)
    })
  }

  // function add to cart (incomplete)
  addToCart(product) {
    this.cartService.addProduct(product);
  }

  // (incomplete)
  getProducts() {
    return this.Products;
  }

}
