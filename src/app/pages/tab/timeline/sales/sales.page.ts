import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import firebase from 'firebase/app';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})

export class SalesPage implements OnInit {

  public segment: string = "allproduct";

  @ViewChild('cart', {static: false, read: ElementRef})fab: ElementRef;

  newCartList = {
    cartId: '',
    userId: '',
    cartProductId: '',
    cartProductName: '',
    cartProductCategory: '',
    cartProductPrice: '',
    cartProductDescription: '',
    cartProductAgreement: '',
    cartProductImage: null
  }

  selectedProductDetail;
  productLists;
  filter: string;

  // individual data
  productName: any;
  productCategory: any;
  productPrice: any;
  productDescription: any;
  productImage: any;

  userId: any;

  constructor(private firestore: AngularFirestore,
              private router: Router,
              public loadingCtrl: LoadingController,
              ) {

                let user = firebase.auth().currentUser;
                this.userId = user.uid;

                this.newCartList.userId = `${user.uid}`;

                this.firestore.collection('productList').valueChanges({idField: 'productId'}).subscribe(
                  (products: any) => {
                    this.productLists = products;
                  }
                );
              }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  ngOnInit() {}

  // masuk ke firebase
  async addToCartDB(productId: string): Promise<void>{
    this.firestore.doc(`productList/${productId}`).valueChanges().subscribe(
      ( productDetail: any ) => {
        this.selectedProductDetail = productDetail;
        this.newCartList.cartProductName = productDetail['productName'];
        this.newCartList.cartProductCategory = productDetail['productCategory'];
        this.newCartList.cartProductPrice = productDetail['productPrice'];
        this.newCartList.cartProductDescription = productDetail['productDescription'];
        this.newCartList.cartProductImage = productDetail['productImage'];
      }
    );

    const loading = await this.loadingCtrl.create();
    loading.present();

      this.newCartList.cartId = this.firestore.createId();
      this.newCartList.cartProductId = productId;

      this.firestore.collection('sale').doc(this.newCartList.userId).collection('cartList').doc(this.newCartList.cartId).set({
        cartId: this.newCartList.cartId,
        userId: this.newCartList.userId,
        cartProductId: this.newCartList.cartProductId,
        cartProductName: this.newCartList.cartProductName,
        cartProductCategory: this.newCartList.cartProductCategory,
        cartProductPrice: this.newCartList.cartProductPrice,
        cartProductDescription: this.newCartList.cartProductDescription,
        cartProductImage: this.newCartList.cartProductImage
      }).then(() => {
        loading.dismiss().then(() => {
          this.router.navigateByUrl('tab/timeline/sales/cart');
        });
      },
       error => {
        loading.dismiss().then(() => {
          console.error(error);
        });
      });
  }

}
