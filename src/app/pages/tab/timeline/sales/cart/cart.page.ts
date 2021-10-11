import { Component, OnInit} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/app'
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart } from 'src/app/models/sales/cart';
import { CartService } from 'src/app/services/sales/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})

export class CartPage implements OnInit {

  public cartList: Observable<Cart[]>;
  cartTotal: string;
  userId: string;

  constructor(private alertCtrl: AlertController,
              private cartService: CartService,
              private router: Router,
              private firestore: AngularFirestore) {

                this.getUserId();
                this.cartList = this.cartService.getCartList(this.userId);
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

  async removeProduct(cartId: string, cartProductName: string) {
    const alert = await this.alertCtrl.create({
      header: 'Remove',
      message: `Are you sure you want to remove ${cartProductName}?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.cartService.deleteProduct(cartId, this.userId).then(() => {
            this.router.navigateByUrl('/tab/timeline/sales/cart');
            })
          }
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    alert.present();
  }

}

