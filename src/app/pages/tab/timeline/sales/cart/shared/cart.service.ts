import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductService } from '../../shared/product.service';
import { NewProduct } from '../../shared/sales.interface';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})

export class CartService {

  private items$ = new BehaviorSubject<CartItem[]>([
    {
      id: 1,
      name: 'Sea Food',
      price: 12,
      image: 'assets/images/foods/seafood-dishes.png',
      quantity: 1,
    },
  ]);

  getCart() {
    return this.items$.asObservable();
  }

  addToCart(newItem: CartItem) {
    this.items$.next([...this.items$.getValue(), newItem]);
  }

  removeItem(id: number) {
    this.items$.next(this.items$.getValue().filter((item) => item.id !== id));
  }

  changeQty(quantity: number, id: number) {
    const items = this.items$.getValue();
    const index = items.findIndex((item) => item.id === id);
    items[index].quantity += quantity;
    this.items$.next(items);
  }

  getTotalAmount() {
    return this.items$.pipe(
      map((items) => {
        let total = 0;
        items.forEach((item) => {
          total += item.quantity * item.price;
        });

        return total;
      })
    );
  }

}
