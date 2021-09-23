import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { ProductService } from '../shared/product.service';

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

  constructor(private firestore: AngularFirestore,
              private alertCtrl: AlertController,
              private productService: ProductService) {
    this.firestore.collection('productList').valueChanges({idField: 'productId'}).subscribe(
      adoptions => {
        this.newProductLists = adoptions;
        console.log(this.newProductLists);
      }
    )
  }

  ngOnInit() {
  }

  deleteProduct(productId: string){
    this.firestore.doc('productList/' + productId).delete();
  }

  async removeProduct(productId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Remove',
      message: 'Are you sure you want to remove?',
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
