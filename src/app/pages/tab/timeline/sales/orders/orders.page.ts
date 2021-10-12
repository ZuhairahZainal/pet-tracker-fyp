import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Orders } from 'src/app/models/orders/orders';
import { SalesService } from 'src/app/services/sales/sales.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  orderStatus = {
    orderStatus: 'Order Completed'
  }

  userId: string;

  public orderList: Observable<Orders[]>

  constructor(private saleService:  SalesService,
              private firestore: AngularFirestore,
              private alertCtrl: AlertController,
              private router: Router) {}

  ngOnInit() {
    this.getUserId();

    this.orderList = this.saleService.getOrderIds(this.userId);
  }


  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  changeStatus(orderId: string){
  // Update Order Status
  this.firestore.collection('sale').doc(this.userId).collection('orders').doc(orderId).update(this.orderStatus)
  .then( async success => {
    let alert = await this.alertCtrl.create({
      header: 'Order Completed',
      message: 'Your order is now complete. Thank you for purchasing from our application.',
      buttons: ['OK']
    });
    alert.present();
    })
  }

  async productReceived(orderId: string){
    const alert = await this.alertCtrl.create({
      header: 'Order Received',
      message: 'Are you sure you already received your orders?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.changeStatus(orderId)
        },
        {
          text: 'No'
        }
      ]
    });
    alert.present();
  }
}
