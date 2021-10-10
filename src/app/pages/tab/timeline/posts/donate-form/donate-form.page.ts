/* eslint-disable object-shorthand */
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { file } from 'src/app/models/file/file';


@Component({
  selector: 'app-donate-form',
  templateUrl: './donate-form.page.html',
  styleUrls: ['./donate-form.page.scss'],
})
export class DonateFormPage implements OnInit {

  newDonationDetail = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    adminApprove: 'Pending',
    category: 'donation',
    donationId: '',
    userId: '',
    userImage: '',
    userName: '',
    donationTitle: '',
    donationType: '',
    donationAmount: '',
    donationDescription: '',
    donationImage: null,
  };

  donationForm: FormGroup;
  userId: string;
  donationId: string;

  userName: string;
  userImage: string;

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

  constructor(private storage: AngularFireStorage,
              private firestore: AngularFirestore,
              public loadingCtrl: LoadingController,
              private router: Router,
              private route: ActivatedRoute,
             ) {

              this.isImgUploading = false;
              this.isImgUploaded = false;

              this.ngFirestoreCollection = firestore.collection<file>('lostPetPost');
              this.files = this.ngFirestoreCollection.valueChanges();
            }


  ngOnInit() {
    this.getUserId();
    this.donationForm = new FormGroup({
      donationTitle: new FormControl(this.newDonationDetail.donationTitle,[
        Validators.required,
        Validators.minLength(2),
      ]),
      donationType: new FormControl(this.newDonationDetail.donationType,[
        Validators.required,
      ]),
      donationAmount: new FormControl(this.newDonationDetail.donationAmount,[
        Validators.required,
      ]),
      donationDescription: new FormControl(this.newDonationDetail.donationDescription,[
        Validators.required,
        Validators.minLength(2),
      ])
    });

    this.donationId = this.route.snapshot.params.donationId || 'new';
  }

  getUserId(){
    const user = firebase.auth().currentUser;

    this.newDonationDetail.userId = `${user.uid}`;
    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetails => {
      this.userName = userDetails['name'];
      this.newDonationDetail.userName = `${this.userName}`;

      this.userImage = userDetails['userImage'];
      this.newDonationDetail.userImage = `${this.userImage}`;

    })
  }

  async createDonationPost(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.newDonationDetail.donationId = this.firestore.createId();
    this.newDonationDetail.donationTitle = this.donationForm.get('donationTitle').value;
    this.newDonationDetail.donationType = this.donationForm.get('donationType').value;
    this.newDonationDetail.donationAmount = this.donationForm.get('donationAmount').value;
    this.newDonationDetail.donationDescription = this.donationForm.get('donationDescription').value;

    this.firestore.collection('feed').doc(this.newDonationDetail.userId).collection('donation').doc(this.newDonationDetail.donationId)
    .set(this.newDonationDetail);

    this.firestore.collection('donationPost').doc(this.newDonationDetail.donationId)
    .set(this.newDonationDetail)

    .then(() => {
      loading.dismiss().then(() => {
        this.donationForm = null;
        this.router.navigateByUrl('tab/timeline');
        });
      },
      error => {
       loading.dismiss().then(() => {
         console.error();
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

    const fileStoragePath = `timeline/donation/${new Date().getTime()}_${file.name}`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          this.newDonationDetail.donationImage = resp;

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
