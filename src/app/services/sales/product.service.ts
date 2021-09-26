import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  newProductList = {
    productName: '',
    productCategory: '',
    productPrice: '',
    productDescription: '',
    productAgreement: '',
    productImage: null
  }

  productId: any;

  constructor(private firestore: AngularFirestore,
              private route: ActivatedRoute,
              private router: Router) {
                this.productId = this.route.snapshot.params.productId;
               }

    // Get Single
    getProduct(productId) {
      return this.firestore.collection('productList').doc(productId).valueChanges({idField: 'productId'});
    }

    // Get List
    getProductList() {
      return this.firestore.collection('productList').snapshotChanges();
    }

    // Update
    updateProduct(productId, productList) {
      this.firestore.collection('productList').doc(productId).update(productList)
      .then(() => {
        this.router.navigate(['tab/timeline/sales/sales-history']);
      }).catch(error => console.log(error));
    }

    // Delete
    deleteProduct(productId: string) {
      this.firestore.doc('productList/' + productId).delete();
    }
}
