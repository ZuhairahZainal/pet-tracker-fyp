import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/app';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.page.html',
  styleUrls: ['./sales-history.page.scss'],
})
export class SalesHistoryPage implements OnInit {

  newProductLists;
  productId: string;
  userId: string;

  newProductList = {
    productName: '',
    productCategory: '',
    productPrice: '',
    productDescription: '',
    productImage: null
  }

  constructor(private firestore: AngularFirestore,
              private alertCtrl: AlertController) {

                this.getUserId();

              this.firestore.collection('sale').doc(this.userId).collection('newProduct').valueChanges({idField: 'productId'}).subscribe(
                products => {
                  this.newProductLists = products;
                }
              )
  }

  ngOnInit() {
    this.getUserId();
  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  deleteProduct(productId: string){
    this.firestore.doc('productList/' + productId).delete();
    this.firestore.collection('sale').doc(this.userId).collection('newProduct').doc(productId).delete();
  }

  async removeProduct(productId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Remove Product',
      message: 'Are you sure you want to remove this product?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.deleteProduct(productId),
        },
        {
          text: 'No',
        },
      ],
    });

    alert.present();
  }

}
