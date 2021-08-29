import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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

  newProductLists;
  productId: string;
  filter: string;

  newProductList = {
    productName: '',
    productCategory: '',
    productPrice: '',
    productDescription: '',
    productImage: null
  }

  constructor(private firestore: AngularFirestore, private cartService: CartService) {

    this.firestore.collection('productList').valueChanges({idField: 'productId'}).subscribe(
      adoptions => {
        this.newProductLists = adoptions;
        console.log(this.newProductLists);
      }
    )
  }

  //filter segment (incomplete)
  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }


  // ambil from firestore database for display
  ngOnInit() {
    this.firestore.doc(`productList/${this.productId}`)
    .valueChanges()
    .subscribe((product: any) => (this.newProductList = product));

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
