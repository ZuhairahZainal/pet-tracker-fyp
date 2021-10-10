import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import firebase from 'firebase/app'
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { file } from 'src/app/models/file/file';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  newProductList = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    adminApprove: 'Pending',
    productId: '',
    userId: '',
    userUsername: '',
    userImage: '',
    productName: '',
    productCategory: '',
    productPrice: '',
    productDescription: '',
    productAgreement: '',
    productImage: null
  }


  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<string>;

  files: Observable<file[]>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  private ngFirestoreCollection: AngularFirestoreCollection<file>;

  productForm: FormGroup;
  productId: string;
  userId: string;
  userUsername: string;
  userImage: string;

  constructor(private storage: AngularFireStorage,
              private firestore: AngularFirestore,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private router: Router,
              private route: ActivatedRoute) {
                this.isImgUploading = false;
                this.isImgUploaded = false;

                this.ngFirestoreCollection = firestore.collection<file>('productList');
                this.files = this.ngFirestoreCollection.valueChanges();
              }

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

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetail => {
      this.newProductList.userUsername = userDetail['name'];
      this.newProductList.userImage = userDetail['userImage'];
    })
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

  uploadPicture(event: Event) {

    let file = (event.target as HTMLInputElement).files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!')
      return;
    }

    this.isImgUploading = true;
    this.isImgUploaded = false;

    this.FileName = file.name;

    const fileStoragePath = `sale/newProduct/${new Date().getTime()}_${file.name}`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          this.newProductList.productImage = resp;

          this.isImgUploading = false;
          this.isImgUploaded = true;
        },error => {
          console.log(error);
        })
      }),
      tap(snap => {
          this.FileSize = snap.totalBytes;
      })
    )
  }
}
