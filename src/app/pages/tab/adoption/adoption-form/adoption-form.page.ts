import { Component, OnInit } from '@angular/core';

// firebase
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import firebase from 'firebase/app';

// routing
import { ActivatedRoute, Router } from '@angular/router';

// form validation
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { file } from 'src/app/models/file/file';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-adoption-form',
  templateUrl: './adoption-form.page.html',
  styleUrls: ['./adoption-form.page.scss'],
})
export class AdoptionFormPage implements OnInit {
  newAdoptionList = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    adminApprove: 'Pending',
    adoptCount: 0,
    adoptionId: '',
    userId: '',
    userImage: '',
    userName: '',
    petAge: '',
    petBreed: '',
    petCategory: '',
    petCondition: '',
    petDescription: '',
    petGender: '',
    petName: '',
    petSpayStatus: '',
    petImage: null,
    petMedicalRecord: null
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

  isMedRecUploading: boolean;
  isMedRecUploaded: boolean;

  private ngFirestoreCollection: AngularFirestoreCollection<file>;


  newAdoptionForm: FormGroup;
  userId: string;
  userName: string;
  userImage: string;

  constructor(private firestore: AngularFirestore,
              private storage: AngularFireStorage,
              public loadingCtrl: LoadingController,
              private router: Router) {
                this.isImgUploading = false;
                this.isImgUploaded = false;

                this.isMedRecUploading = false;
                this.isMedRecUploaded = false;

                this.ngFirestoreCollection = firestore.collection<file>('adoptionPost');
                this.files = this.ngFirestoreCollection.valueChanges();
               }

  ngOnInit() {
    this.getUserId();
    this.newAdoptionForm = new FormGroup({
      petAge: new FormControl(this.newAdoptionList.petAge,[
        Validators.required,
        Validators.min(0),
      ]),
      petBreed: new FormControl(this.newAdoptionList.petBreed,[
        Validators.required,
        Validators.minLength(2),
      ]),
      petCategory: new FormControl(this.newAdoptionList.petCategory,[
        Validators.required,
      ]),
      petCondition: new FormControl(this.newAdoptionList.petCondition,[
        Validators.required,
        Validators.minLength(2),
      ]),
      petDescription: new FormControl(this.newAdoptionList.petDescription,[
        Validators.required,
        Validators.minLength(10),
      ]),
      petGender: new FormControl(this.newAdoptionList.petGender,[
        Validators.required,
      ]),
      petName: new FormControl(this.newAdoptionList.petName,[
        Validators.required,
        Validators.minLength(2),
      ]),
      petSpayStatus: new FormControl(this.newAdoptionList.petSpayStatus,[
        Validators.required,
      ])
    });
  }

  getUserId(){
    const user = firebase.auth().currentUser;

    this.newAdoptionList.userId = `${user.uid}`;
    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetails => {
      this.userName = userDetails['name'];
      this.newAdoptionList.userName = `${this.userName}`;

      this.userImage = userDetails['userImage'];
      this.newAdoptionList.userImage = `${this.userImage}`;
    })
  }

  async savePost(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.newAdoptionList.adoptionId = this.firestore.createId();
    this.newAdoptionList.petAge = this.newAdoptionForm.get('petAge').value;
    this.newAdoptionList.petBreed = this.newAdoptionForm.get('petBreed').value;
    this.newAdoptionList.petCategory = this.newAdoptionForm.get('petCategory').value;
    this.newAdoptionList.petCondition = this.newAdoptionForm.get('petCondition').value;
    this.newAdoptionList.petDescription = this.newAdoptionForm.get('petDescription').value;
    this.newAdoptionList.petGender = this.newAdoptionForm.get('petGender').value;
    this.newAdoptionList.petName = this.newAdoptionForm.get('petName').value;
    this.newAdoptionList.petSpayStatus = this.newAdoptionForm.get('petSpayStatus').value;

    this.firestore.collection('adoption').doc(this.newAdoptionList.userId)
    .collection('adoptionDetail').doc(this.newAdoptionList.adoptionId)
    .set(this.newAdoptionList);

    this.firestore.collection('adoptionPost').doc(this.newAdoptionList.adoptionId)
    .set(this.newAdoptionList)

    .then(() => {
      loading.dismiss().then(() => {
        this.newAdoptionForm = null;
        this.router.navigateByUrl('tab/adoption');
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

    const fileStoragePath = `adoption/petImage/${new Date().getTime()}_${file.name}`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          this.newAdoptionList.petImage = resp;

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

  uploadMedicalRecord(event: Event) {

    let file = (event.target as HTMLInputElement).files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!')
      return;
    }

    this.isMedRecUploading = true;
    this.isMedRecUploaded = false;

    this.FileName = file.name;

    const fileStoragePath = `adoption/petMedicalRecord/${new Date().getTime()}_${file.name}`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          this.newAdoptionList.petMedicalRecord = resp;

          this.isMedRecUploading = false;
          this.isMedRecUploaded = true;
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
