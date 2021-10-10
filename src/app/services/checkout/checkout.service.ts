import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Address, CardDetail } from 'src/app/models/checkout/checkout';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(public firestore: AngularFirestore) { }

  // fetch User Address
  getAddressDetail(userId: string): Observable<Address[]> {
    return this.firestore.collection('sale').doc(userId).collection<Address>(`newaddressDetails`).valueChanges();
  }

  // fetch User Card Detail
  getCardDetail(userId: string): Observable<CardDetail[]> {
    return this.firestore.collection('sale').doc(userId).collection<CardDetail>(`newcardDetails`).valueChanges();
  }
}

