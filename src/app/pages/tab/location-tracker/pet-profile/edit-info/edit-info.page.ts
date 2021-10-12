import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { file } from 'src/app/models/file/file';
import firebase from 'firebase/app'
import { finalize, tap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.page.html',
  styleUrls: ['./edit-info.page.scss'],
})
export class EditInfoPage implements OnInit {

  updatedPetDetail = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    userImage: '',
    userName: '',
    petName: '',
    petBreed: '',
    petGender: '',
    petHealthCondition: '',
    petBio: '',
    petBirthdate: '',
    petImage: null,
  }

  userId: string;
  userName: string;
  userImage: string;

  petId: any;
  petName: any;
  petBreed: any;
  petGender: any;
  petHealthCondition: any;
  petBio: any;
  petBirthdate: any;
  petImage:any;

  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<any>;

  files: Observable<file[]>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  updatePetProfile: FormGroup;

  private ngFirestoreCollection: AngularFirestoreCollection<file>;

  constructor(private firestore: AngularFirestore,
              private storage: AngularFireStorage,
              public loadingCtrl: LoadingController,
              private router: Router) {

      this.isImgUploading = false;
      this.isImgUploaded = false;

      this.ngFirestoreCollection = firestore.collection<file>('productList');
      this.files = this.ngFirestoreCollection.valueChanges();

  }

  ngOnInit() {
    this.getUserId();
    this.updatePetProfile = new FormGroup({
      petBirthdate: new FormControl(this.updatedPetDetail.petBirthdate,[
        Validators.required
      ]),
      petBreed: new FormControl(this.updatedPetDetail.petBreed,[
        Validators.required,
        Validators.minLength(2),
      ]),
      petCategory: new FormControl(this.updatedPetDetail.petBio,[
        Validators.required,
        Validators.minLength(5)
      ]),
      petCondition: new FormControl(this.updatedPetDetail.petHealthCondition,[
        Validators.required,
        Validators.minLength(2),
      ]),
      petGender: new FormControl(this.updatedPetDetail.petGender,[
        Validators.required,
      ]),
      petName: new FormControl(this.updatedPetDetail.petName,[
        Validators.required,
        Validators.minLength(2),
      ])
    });
  }

  getUserId(){
    const user = firebase.auth().currentUser;

    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetails => {
      this.userName = userDetails['name'];
      this.updatedPetDetail.userName = `${this.userName}`;

      this.userImage = userDetails['userImage'];
      this.updatedPetDetail.userImage = `${this.userImage}`;
    })
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

    const fileStoragePath = `pets/${this.userId}/${this.petId}/petImage`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          // this.newProductList.productImage = resp;

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

  submitUpdate(){

  }
}
