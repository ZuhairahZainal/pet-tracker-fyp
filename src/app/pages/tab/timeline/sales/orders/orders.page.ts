import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
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
              private router: Router) {}

  ngOnInit() {
    this.getUserId();

    this.orderList = this.saleService.getOrderIds(this.userId);
  }


  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  productReceived(orderId: string){
  // Update Order Status
  this.firestore.collection('sale').doc(this.userId).collection('orders').doc(orderId).update(this.orderStatus)
    .then(() => {
      this.router.navigate(['tab/timeline/sales/orders']);
    }).catch(error => console.log(error));
  }
}
