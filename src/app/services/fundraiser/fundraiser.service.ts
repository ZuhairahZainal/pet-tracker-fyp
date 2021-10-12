import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CardDetail } from 'src/app/models/checkout/checkout';

@Injectable({
  providedIn: 'root'
})
export class FundraiserService {

  constructor(public firestore: AngularFirestore) { }

  // fetch User Card Details
  getCardDetail(userId: string): Observable<CardDetail[]> {
    return this.firestore.collection('users').doc(userId).collection<CardDetail>(`cardDetails`).valueChanges();
  }
}
