import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Address } from 'src/app/models/checkout/checkout';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { CardDetail } from 'src/app/models/checkout/checkout';
import { Orders, ProductDetail } from 'src/app/models/orders/orders';
import { SalesService } from 'src/app/services/sales/sales.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  allOrders: AngularFirestoreCollection<any>;
  orders: Observable<any[]>;
  userId: string;

  public cardDetail: Observable<CardDetail[]>
  public addressDetail: Observable<Address[]>
  public productDetail: Observable<ProductDetail[]>

  public orderDetails: any[] = [];
  public orderId: any[] = [];

  constructor(private firestore: AngularFirestore,
              private saleServices: SalesService) {

                this.getUserId();

                this.allOrders = this.firestore.collection(`sale/${this.userId}/orders`);
                this.orders = this.allOrders.snapshotChanges();

              }

  ngOnInit() {
    this.getUserId();

    // this.cardDetail = this.saleServices.getCardDetail(this.userId, this.orderId);
    // this.addressDetail = this.saleServices.getAddressDetail(this.userId, this.orderId);
    // this.productDetail = this.saleServices.getProductDetails(this.userId, this.orderId);

    this.orders.forEach( res => {
      res.forEach( orders => {
        let data = orders.payload.doc.data();
        let id = orders.payload.doc.id;

        this.orderDetails.push(data);
        this.orderId.push(id);
      });
    });
  }


  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

}
