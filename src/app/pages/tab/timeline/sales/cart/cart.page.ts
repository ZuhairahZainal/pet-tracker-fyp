import { Component, OnInit} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})

export class CartPage implements OnInit {

  cartItems$: Observable<any[]>;
  totalAmount$: Observable<number>;
  cartLists;
  productDetail;
  totalCart;
  cartId;

  newCartList = new BehaviorSubject<any[]>([
    {
    productId: '',
    productName: '',
    productCategory: '',
    productPrice: null,
    productDescription: '',
    productImage: null
  }
]);

  constructor(
              private alertCtrl: AlertController,
              private firestore: AngularFirestore) {


                this.firestore.collection('cartList').valueChanges({idField: 'cartId'}).subscribe(
                  (products: any) => {
                    this.newCartList = products;
                    console.log(this.newCartList);
                  }
                );

                this.firestore.collection('cartList').valueChanges({idField: 'cartId'}).subscribe(
                  (products: any) => {
                    this.cartLists = products;
                    console.log(this.cartLists);
                  }
                );
              }

  ngOnInit() {
    this.totalAmount$ = this.getTotalAmount();
  }

  getTotalAmount() {
    return this.newCartList.pipe(
      map((items) => {
        let total = 0;
        items.forEach((item) => {
          total += item.productPrice;
        });
        return total;
      })
    );
  }

  async removeProduct(cartId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Remove',
      message: 'Are you sure you want to remove?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.deleteProduct(cartId),
        },
        {
          text: 'No',
        },
      ],
    });

    alert.present();

  }

  deleteProduct(cartId: string) {
    this.firestore.doc('cartList/' + cartId).delete();
  }

}

