import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/sales/cart';
import { CartService } from 'src/app/services/sales/cart.service';
import firebase from 'firebase/app';
import { Address, CardDetail } from 'src/app/models/checkout/checkout';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

  public cartList: Observable<Cart[]>;
  public address: Observable<Address[]>;
  public cardDetail: Observable<CardDetail[]>;

  public productIds: any[] = [];

  userId: string;
  orderId: any;
  cartTotal: string;

  // cart
  productId: any;
  productDetail: any;

  // order
  order: any;
  orderAddressId: any;
  orderCardId: any;
  orderProductId: any;

  // card
  cardId: any;
  creditCardNumber: number;
  cvv: number;
  expiration: any;
  firstName: string;
  lastName: string;

  // address
  addressId: any;
  num: number;
  simpang: number;
  kampung: string;
  postCode: string;
  cityName: string;
  countryName: string;

  allCarts: AngularFirestoreCollection<any>;
  products: Observable<any[]>;

  constructor(private cartService: CartService,
              private checkoutService: CheckoutService,
              private alertCtrl: AlertController,
              private router: Router,
              private firestore: AngularFirestore)  {
    this.getUserId();

    this.cartList = this.cartService.getCartList(this.userId);

    this.allCarts = this.firestore.collection(`sale/${this.userId}/cartList`);
    this.products = this.allCarts.snapshotChanges();

    this.address = this.checkoutService.getAddressDetail(this.userId);

    this.firestore.collection('sale').doc(this.userId).collection('newcardDetails').valueChanges({idField: 'cardId'}).subscribe(
      cardInfos => {
        this.cardId = cardInfos[0].cardId;
        this.creditCardNumber = cardInfos[0].creditCardNumber;
        this.cvv = cardInfos[0].cvv;
        this.expiration = cardInfos[0].expiration;
        this.firstName = cardInfos[0].firstName;
        this.lastName = cardInfos[0].lastName;
        this.userId = cardInfos[0].userId;
    })

    this.cardDetail = this.checkoutService.getCardDetail(this.userId);

    this.firestore.collection('sale').doc(this.userId).collection('newaddressDetails').valueChanges({idField: 'addressId'}).subscribe(
      addressInfos => {
        this.addressId = addressInfos[0].addressId;
        this.num = addressInfos[0].num;
        this.simpang = addressInfos[0].simpang;
        this.kampung = addressInfos[0].kampung;
        this.postCode = addressInfos[0].postCode;
        this.cityName = addressInfos[0].cityName;
        this.countryName = addressInfos[0].countryName;
    })

    }

  ngOnInit() {
   this.getTotal();

  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  getTotal(){
    let cartTotal = 0;
    this.firestore.collection('sale').doc(this.userId).collection('cartList').get().subscribe(
    (querySnapshot) => {
      querySnapshot.forEach(
        (doc) => {
          cartTotal += doc.data().cartProductPrice;
        }
      );
      this.cartTotal = `${cartTotal}`;
      console.log(this.cartTotal);
      }
    );
  }

  addToOrder(){
    this.orderId = this.firestore.createId();
    this.orderAddressId = this.firestore.createId();
    this.orderCardId = this.firestore.createId();
    this.orderProductId = this.firestore.createId();

    this.order = {
      orderId: this.orderId,
      totalAmount: this.cartTotal,
      orderStatus: 'Purchase Successful',
      time: new Date().getTime(),
      date: new Date().toDateString(),
    }

    this.firestore.collection('sale').doc(this.userId).collection('orders').doc(this.orderId).set(this.order);

    this.firestore.collection('sale').doc(this.userId).collection('orders').doc(this.orderId).collection('addressDetail').doc(this.orderId).set({
      orderAddressId: this.orderAddressId,
      userId: this.userId,
      addressId: this.addressId,
      addressNo: this.num,
      simpang: this.simpang,
      kampung: this.kampung,
      postCode: this.postCode,
      cityName: this.cityName,
      countryName: this.countryName
    });

    this.products.forEach( user => {
      user.forEach( product =>{
        let data = product.payload.doc.data();
        let id = product.payload.doc.id;

        console.log( "ID: ", id, " Data: " , data );

        this.firestore.collection('sale').doc(this.userId).collection('orders').doc(this.orderId).collection('productDetails').doc(id).set(data);

        this.firestore.collection('sale').doc(this.userId).collection('cartList').doc(id).delete();

        });
    });

    this.firestore.collection('sale').doc(this.userId).collection('orders').doc(this.orderId).collection('cardDetail').doc(this.orderId).set({
      orderCardId: this.orderCardId,
      cardId: this.cardId,
      creditCardNumber: this.creditCardNumber,
      cvv: this.cvv,
      cardExpiration: this.expiration,
      firstName: this.firstName,
      lastName: this.lastName,
      totalAmount: this.cartTotal,
      orderId: this.orderId,
      userId: this.userId
    }).then( async success => {
      let alert = await this.alertCtrl.create({
        header: 'Purchase Successful',
        subHeader: 'Please Check Your Order Summary',
        message: 'Your purchase is successful! Summary of your order can be found in Orders Section',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['tab/timeline/sales/orders']);
          }
        }]
      });
      alert.present();
    })
  }

  async completePurchase(){
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Are you sure the details are correct?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.addToOrder(),
        },
        {
          text: 'No',
        },
      ],
    });

    alert.present();
  }

}
