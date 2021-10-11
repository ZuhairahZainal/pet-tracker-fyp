import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { SalesService } from 'src/app/services/sales/sales.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Address, CardDetail } from 'src/app/models/checkout/checkout';
import { Product } from 'src/app/models/sales/product';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  orderId: string;
  userId: string;

  public addressDetails: Address;
  public cardDetails: CardDetail;

  public productDetails: any[] = [];

  allOrders: AngularFirestoreCollection<any>;
  orders: Observable<any[]>;


  constructor(private firestore: AngularFirestore,
              private salesService: SalesService,
              private alertCtrl: AlertController,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

                this.orderId = this.activatedRoute.snapshot.paramMap.get('id');

                this.getUserId();

                this.allOrders = this.firestore.collection(`sale/${this.userId}/orders/${this.orderId}/productDetails`);
                this.orders = this.allOrders.snapshotChanges();

              }

  ngOnInit() {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getUserId();

    this.orders.forEach( res => {

      res.forEach( orders => {
        let data = orders.payload.doc.data();
        let id = orders.payload.doc.id;

        this.firestore.collection('sale').doc(this.userId).collection('orders')
        .doc(this.orderId).collection(`productDetails`).valueChanges().subscribe( product => {
          this.productDetails = product;
        });
      });

    });


    this.salesService.getAddressDetail(this.userId, this.orderId).subscribe( address => {
      this.addressDetails = address;
    })

    this.salesService.getCardDetail(this.userId, this.orderId).subscribe( card => {
      this.cardDetails = card;
    })


  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

}
