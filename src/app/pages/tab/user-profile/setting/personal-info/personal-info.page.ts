import { Component, OnInit } from '@angular/core';
import { AngularFirestore,  AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { LoadingController } from '@ionic/angular';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { file } from 'src/app/models/file/file';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
})
export class PersonalInfoPage implements OnInit {

  newUserDetail = {
    name: '',
    userImage: null,
    userBio: ''
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

  updateUserDetail: FormGroup;
  userId: any;
  userUsername: any;
  userFirstName: any;
  userLastName: any;
  userDOB: any;
  userPhone: any;
  userEmail: any;
  userImage: any;
  userBio: any;

  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    public loadingCtrl: LoadingController,
    public fb: FormBuilder,
    private router: Router) {

      this.isImgUploading = false;
      this.isImgUploaded = false;

      this.ngFirestoreCollection = firestore.collection<file>('users');
      this.files = this.ngFirestoreCollection.valueChanges();


      this.setUserId();

      this.firestore.doc(`/users/${this.userId}`).valueChanges().subscribe(
        profile => {
          this.userUsername = profile['name'];
          this.userFirstName = profile['firstname'];
          this.userLastName = profile['lastname'];
          this.userDOB = profile['dob'];
          this.userPhone = profile['phone'];
          this.userEmail = profile['email'];
          this.userImage = profile['userImage'];
          this.userBio = profile['userBio']
        })
    }

  ngOnInit(){
    this.setUserId();

    this.updateUserDetail = new FormGroup({
      name: new FormControl(this.newUserDetail.name, [
        Validators.minLength(2),
        Validators.required,
      ]),
      userBio: new FormControl(this.newUserDetail.userBio, [
        Validators.minLength(1),
        Validators.required,
      ])
    });
  }

  setUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  async updateForm(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.newUserDetail.name = this.updateUserDetail.get('name').value;
    this.newUserDetail.userBio = this.updateUserDetail.get('userBio').value;

    this.firestore.collection('users').doc(this.userId).update({
      name: this.newUserDetail.name,
      userBio: this.newUserDetail.userBio
    })
    .then(() => {
      loading.dismiss().then(() => {
        this.router.navigate(['tab/user-profile']);
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

    const fileStoragePath = `users/${this.userId}/image.png`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          this.newUserDetail.userImage = resp;

          this.firestore.collection('users').doc(this.userId).update({
            userImage: this.newUserDetail.userImage
          });
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
