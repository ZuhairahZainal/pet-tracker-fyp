import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/sales/cart';
import { CartService } from 'src/app/services/sales/cart.service';
import firebase from 'firebase/app';
import { Address, CardDetail } from 'src/app/models/checkout/checkout';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  public cartList: Observable<Cart[]>;
  public address: Observable<Address[]>;
  public cardDetail: Observable<CardDetail[]>;


  userId: string;
  cartTotal: string;

  constructor(private cartService: CartService,
              private checkoutService: CheckoutService,
              private alertCtrl: AlertController,
              private router: Router,
              private firestore: AngularFirestore)  {
    this.getUserId();

    this.cartList = this.cartService.getCartList(this.userId);

    this.address = this.checkoutService.getAddressDetail(this.userId);

    this.cardDetail = this.checkoutService.getCardDetail(this.userId);

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

    async deleteCard(id: string){
      const alert = await this.alertCtrl.create({
        header: 'Delete Post',
        message: 'Are you sure you want to delete this post?',
        buttons: [
          {
            text: 'Yes',
            handler: () => this.removeCard(id),
          },
          {
            text: 'No',
          },
        ],
      });

      alert.present();
    }

    removeCard(id: string){
      this.firestore.collection('sale').doc(this.userId).collection('newcardDetails').doc(id).delete().then(() => {
        this.router.navigate(['tab/timeline/sales/cart/checkout']);
      })
    }

    async deleteAddress(id: string){
      const alert = await this.alertCtrl.create({
        header: 'Delete Post',
        message: 'Are you sure you want to delete this post?',
        buttons: [
          {
            text: 'Yes',
            handler: () => this.removeAddress(id),
          },
          {
            text: 'No',
          },
        ],
      });

      alert.present();
    }

    removeAddress(id: string){
      this.firestore.collection('sale').doc(this.userId).collection('newaddressDetails').doc(id).delete().then(() => {
        this.router.navigate(['tab/timeline/sales/cart/checkout']);
      })
    }

}
