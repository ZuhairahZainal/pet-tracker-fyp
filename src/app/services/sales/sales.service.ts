import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Orders, ProductDetail } from 'src/app/models/orders/orders';
import { Address, CardDetail } from 'src/app/models/checkout/checkout';


@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(public firestore: AngularFirestore) { }

  // fetch product detail
  getProductDetails(userId: string, orderId): Observable<ProductDetail> {
    return this.firestore.collection('sale').doc(userId).collection('orders').doc(orderId).collection(`productDetails`).doc<ProductDetail>(orderId).valueChanges();
  }

  // fetch address detail
  getAddressDetail(userId: string, orderId): Observable<Address> {
    return this.firestore.collection('sale').doc(userId).collection('orders').doc(orderId).collection(`addressDetail`).doc<Address>(orderId).valueChanges();
  }

  // fetch card detail
  getCardDetail(userId: string, orderId): Observable<CardDetail> {
    return this.firestore.collection('sale').doc(userId).collection('orders').doc(orderId).collection(`cardDetail`).doc<CardDetail>(orderId).valueChanges();
  }

  // fetch order ids
  getOrderIds(userId: string,): Observable<Orders[]>{
    return this.firestore.collection('sale').doc(userId).collection<Orders>(`orders`, ref => ref.orderBy('time', 'desc')).valueChanges();
  }
}
