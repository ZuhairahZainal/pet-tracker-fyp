import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart } from 'src/app/models/sales/cart';

// export interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

@Injectable({
  providedIn: 'root'
})

export class CartService {

  constructor(public firestore: AngularFirestore) { }

  getCartList(userId: string): Observable<Cart[]> {
    return this.firestore.collection('sale').doc(userId).collection<Cart>(`cartList`).valueChanges();
  }

  deleteProduct(cartId: string, userId: string): Promise<void> {
    return this.firestore.collection(`sale/${userId}`).doc('/cartList/' + `${cartId}`).delete();
  }

  // private items$ = new BehaviorSubject<CartItem[]>([
  //   {
  //     id: 1,
  //     name: 'Sea Food',
  //     price: 12,
  //     image: 'assets/images/foods/seafood-dishes.png',
  //     quantity: 1,
  //   },
  // ]);

  // getCart() {
  //   return this.items$.asObservable();
  // }

  // addToCart(newItem: CartItem) {
  //   this.items$.next([...this.items$.getValue(), newItem]);
  // }

  // removeItem(id: number) {
  //   this.items$.next(this.items$.getValue().filter((item) => item.id !== id));
  // }

  // changeQty(quantity: number, id: number) {
  //   const items = this.items$.getValue();
  //   const index = items.findIndex((item) => item.id === id);
  //   items[index].quantity += quantity;
  //   this.items$.next(items);
  // }

  // getTotalAmount() {
  //   return this.items$.pipe(
  //     map((items) => {
  //       let total = 0;
  //       items.forEach((item) => {
  //         total += item.quantity * item.price;
  //       });

  //       return total;
  //     })
  //   );
  // }

}
