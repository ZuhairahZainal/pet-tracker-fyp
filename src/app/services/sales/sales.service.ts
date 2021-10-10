import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProductDetail } from 'src/app/models/orders/orders';
import { Address, CardDetail } from 'src/app/models/checkout/checkout';


@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(public firestore: AngularFirestore) { }

  // fetch orders
  getProductDetails(userId: string, orderId): Observable<ProductDetail[]> {
    return this.firestore.collection('sale').doc(userId).collection('orders').doc(orderId).collection<ProductDetail>(`productDetails`).valueChanges();
  }

  // fetch address
  getAddressDetail(userId: string, orderId): Observable<Address[]> {
    return this.firestore.collection('sale').doc(userId).collection('orders').doc(orderId).collection<Address>(`addressDetail`).valueChanges();
  }

  // fetch crad
  getCardDetail(userId: string, orderId): Observable<CardDetail[]> {
    return this.firestore.collection('sale').doc(userId).collection('orders').doc(orderId).collection<CardDetail>(`cardDetail`).valueChanges();
  }
}
