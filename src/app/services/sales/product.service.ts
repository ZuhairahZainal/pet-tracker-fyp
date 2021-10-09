import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/sales/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(public firestore: AngularFirestore,
              private router: Router) {}

  getUserProduct(userId: string, productId: string): Observable<Product>{
    return this.firestore.collection('sale').doc(userId).collection('newProduct', ref => ref.orderBy('createdAt', 'desc')).doc<Product>(productId).valueChanges();
  }

    // Update
    updateProduct(userId, productId, productList) {
      this.firestore.collection('sale').doc(userId).collection('newProduct').doc(productId).update(productList)
      .then(() => {
        this.router.navigate(['tab/timeline/sales/sales-history']);
      }).catch(error => console.log(error));
    }

    // Delete
    deleteProductPost(productId: string): Promise<void> {
      return this.firestore.doc('productList/' + productId).delete();
    }

    deleteProduct(productId: string, userId: string): Promise<void> {
      return this.firestore.collection('sale').doc(userId).collection('newProduct').doc('productList/' + productId).delete();
    }

}
