import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

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
  product: any;
  cartId: string;
  filter: string;
  productId: string;
  productCategory;

  constructor(private firestore: AngularFirestore,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public loadingCtrl: LoadingController,
              ) {

                this.firestore.collection('productList').valueChanges({idField: 'productId'}).subscribe(
                  (products: any) => {
                    this.productLists = products;
                    console.log(this.productLists);
                  }
                );
              }

  //filter segment (incomplete)
  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  ngOnInit() {
  }

  // masuk ke firebase
  async addToCartDB(productId: string){
    this.firestore.doc(`productList/${productId}`).valueChanges().subscribe(
      ( productDetail: any ) => {
        this.selectedProductDetail = productDetail;
        console.log(this.selectedProductDetail);
      }
    );

    const loading = await this.loadingCtrl.create();

      this.newCartList.cartId = this.firestore.createId();
      this.newCartList = this.selectedProductDetail;

      this.firestore.collection('cartList').add(this.newCartList).then(() => {
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
