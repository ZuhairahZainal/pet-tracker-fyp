import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import firebase from 'firebase/app'

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  newProductList = {
    productId: '',
    userId: '',
    productName: '',
    productCategory: '',
    productPrice: '',
    productDescription: '',
    productAgreement: '',
    productImage: null
  }

  productForm: FormGroup;
  productId: string;
  userId: string;

  constructor(private storage: AngularFireStorage,
              private firestore: AngularFirestore,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.getUserId();
    this.productForm = new FormGroup({
      productName: new FormControl(this.newProductList.productName,[
        Validators.required,
        Validators.minLength(2),
      ]),
      productCategory: new FormControl(this.newProductList.productCategory,[
        Validators.required,
      ]),
      productPrice: new FormControl(this.newProductList.productPrice,[
        Validators.required,
      ]),
      productDescription: new FormControl(this.newProductList.productDescription,[
        Validators.required,
        Validators.minLength(2)
      ]),
      productAgreement: new FormControl(this.newProductList.productAgreement,[
        Validators.required,
      ])
    });

    this.productId = this.route.snapshot.params.productId || 'new';
  }

  getUserId(){
    let user = firebase.auth().currentUser;

    this.userId = user.uid;
    this.newProductList.userId = `${user.uid}`;
  }

  //submit form, send data to database
  async formSubmit(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.newProductList.productId = this.firestore.createId();
    this.newProductList.productName = this.productForm.get('productName').value;
    this.newProductList.productCategory = this.productForm.get('productCategory').value;
    this.newProductList.productPrice = this.productForm.get('productPrice').value;
    this.newProductList.productDescription = this.productForm.get('productDescription').value;
    this.newProductList.productAgreement = this.productForm.get('productAgreement').value;

    this.firestore.collection('sale').doc(this.newProductList.userId)
    .collection('newProduct').doc(this.newProductList.productId)
    .set(this.newProductList);

    this.firestore.collection('productList').doc(this.newProductList.productId)
    .set(this.newProductList).then(() => {
      loading.dismiss().then(() => {
        this.productForm = null;
        this.router.navigateByUrl('tab/timeline/sales/sales-history');
      });
    },
    error => {
      loading.dismiss().then(() => {
        console.error(error);
      });
    });

  }

  async takePicture(): Promise<void>{
    try{
      const productImage = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });

      const productImageRef = this.storage.ref(
        `productList/${new Date().getTime()}/productImage.png`
      );

      productImageRef.putString(productImage.base64String, 'base64', {
        contentType: 'image/png',
      })
      .then(() =>{
        productImageRef.getDownloadURL().subscribe(downloadURL => {
          this.newProductList.productImage = downloadURL;
        })
      })
    }catch(error){
      console.warn(error);
    }
  }

}
