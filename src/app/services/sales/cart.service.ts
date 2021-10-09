import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/sales/cart';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  constructor(public firestore: AngularFirestore) { }

  getCartList(userId: string): Observable<Cart[]> {
    return this.firestore.collection('sale').doc(userId).collection<Cart>(`cartList`).valueChanges();
  }

  deleteProduct(cartId: string, userId: string) {
    return this.firestore.collection('sale').doc(userId).collection('cartList').doc(cartId).delete();
  }
}
