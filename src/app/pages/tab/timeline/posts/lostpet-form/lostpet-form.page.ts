/* eslint-disable object-shorthand */
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { file } from 'src/app/models/file/file';

@Component({
  selector: 'app-lostpet-form',
  templateUrl: './lostpet-form.page.html',
  styleUrls: ['./lostpet-form.page.scss'],
})
export class LostpetFormPage implements OnInit {

  newLostPetDetail = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    adminApprove: 'Pending',
    category: 'lostPet',
    lostPetId: '',
    userId: '',
    userImage: '',
    userName: '',
    petName: '',
    petGender: '',
    petBreed: '',
    petColor: '',
    lastLocation: '',
    reward: '',
    rewardAmount: '',
    description: '',
    petImage: null,
  };

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

  lostpetForm: FormGroup;
  userId: string;
  lostpetId: string;

  userName: string;
  userImage: string;

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
    // this.getUserName();
    this.lostpetForm = new FormGroup({
      petName: new FormControl(this.newLostPetDetail.petName,[
        Validators.required,
        Validators.minLength(2)
      ]),

      petBreed: new FormControl(this.newLostPetDetail.petBreed,[
        Validators.required,
        Validators.minLength(2),
      ]),

      petGender: new FormControl(this.newLostPetDetail.petGender,[
        Validators.required,
      ]),

      petColor: new FormControl(this.newLostPetDetail.petColor,[
        Validators.required,
        Validators.minLength(2),
      ]),

      lastLocation: new FormControl(this.newLostPetDetail.lastLocation,[
        Validators.required,
      ]),

      reward: new FormControl(this.newLostPetDetail.reward,[
        Validators.required,
      ]),

      rewardAmount: new FormControl(this.newLostPetDetail.rewardAmount,[
        Validators.required,
      ]),

      description: new FormControl(this.newLostPetDetail.description,[
        Validators.required,
      ])
    });

    this.lostpetId = this.route.snapshot.params.lostpetId || 'new';
  }

  getUserId(){
    const user = firebase.auth().currentUser;

    this.newLostPetDetail.userId = `${user.uid}`;
    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetails => {
      this.userName = userDetails['name'];
      this.newLostPetDetail.userName = `${this.userName}`;

      this.userImage = userDetails['userImage'];
      this.newLostPetDetail.userImage = `${this.userImage}`;
    })
  }

  async createLostPetPost(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.newLostPetDetail.lostPetId = this.firestore.createId();
    this.newLostPetDetail.petName = this.lostpetForm.get('petName').value;
    this.newLostPetDetail.petGender = this.lostpetForm.get('petGender').value;
    this.newLostPetDetail.petBreed = this.lostpetForm.get('petBreed').value;
    this.newLostPetDetail.petColor = this.lostpetForm.get('petColor').value;
    this.newLostPetDetail.lastLocation = this.lostpetForm.get('lastLocation').value;
    this.newLostPetDetail.reward = this.lostpetForm.get('reward').value;
    this.newLostPetDetail.rewardAmount = this.lostpetForm.get('rewardAmount').value;
    this.newLostPetDetail.description = this.lostpetForm.get('description').value;

    this.firestore.collection('feed').doc(this.newLostPetDetail.userId).collection('lostPet').doc(this.newLostPetDetail.lostPetId)
    .set(this.newLostPetDetail);

    this.firestore.collection('lostPetPost').doc(this.newLostPetDetail.lostPetId)
    .set(this.newLostPetDetail).then(() => {
      loading.dismiss().then(() => {
        this.lostpetForm = null;
        this.router.navigateByUrl('tab/timeline');
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

    const fileStoragePath = `timeline/lostPet/${new Date().getTime()}_${file.name}`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          this.newLostPetDetail.petImage = resp;

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
