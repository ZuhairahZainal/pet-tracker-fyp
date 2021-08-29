import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.page.html',
  styleUrls: ['./sales-history.page.scss'],
})
export class SalesHistoryPage implements OnInit {

  newProductLists;
  productId: string;

  newProductList = {
    productName: '',
    productCategory: '',
    productPrice: '',
    productDescription: '',
    productImage: null
  }

  constructor(private firestore: AngularFirestore) {
    this.firestore.collection('productList').valueChanges({idField: 'productId'}).subscribe(
      adoptions => {
        this.newProductLists = adoptions;
        console.log(this.newProductLists);
      }
    )
  }

  ngOnInit() {
    this.firestore.doc(`productList/${this.productId}`)
    .valueChanges()
    .subscribe((product: any) => (this.newProductList = product));
  }

  // delete function not yet
  deleteProduct(productId) {
    // console.log(productId)
    // if (window.confirm('Do you really want to delete?')) {
    //   if(this.productId !== 'new'){
    //     this.firestore.doc(`productList/${this.productId}`).delete();
    //   }
    // }
  }

}
