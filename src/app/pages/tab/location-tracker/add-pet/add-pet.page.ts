import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { file } from 'src/app/models/file/file';
import firebase from 'firebase/app';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.page.html',
  styleUrls: ['./add-pet.page.scss'],
})
export class AddPetPage implements OnInit {

  newPet = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    petId: '',
    userId: '',
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

  petId: string;

  userId: string;
  userName: string;
  userImage: string;

  addNewPet: FormGroup;

  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<string>;

  files: Observable<file[]>;

  private ngFirestoreCollection: AngularFirestoreCollection<file>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  constructor(private firestore: AngularFirestore,
              private storage: AngularFireStorage,
              public loadingCtrl: LoadingController,
              private router: Router) {


          this.isImgUploading = false;
          this.isImgUploaded = false;

          this.ngFirestoreCollection = firestore.collection<file>('pets');
          this.files = this.ngFirestoreCollection.valueChanges();
  }

  ngOnInit() {
    this.getUserId();
    this.addNewPet = new FormGroup({
      petBirthdate: new FormControl(this.newPet.petBirthdate,[
        Validators.required
      ]),
      petBreed: new FormControl(this.newPet.petBreed,[
        Validators.required,
        Validators.minLength(2),
      ]),
      petCategory: new FormControl(this.newPet.petBio,[
        Validators.required,
        Validators.minLength(5)
      ]),
      petCondition: new FormControl(this.newPet.petHealthCondition,[
        Validators.required,
        Validators.minLength(2),
      ]),
      petGender: new FormControl(this.newPet.petGender,[
        Validators.required,
      ]),
      petName: new FormControl(this.newPet.petName,[
        Validators.required,
        Validators.minLength(2),
      ])
    });
  }

  getUserId(){
    const user = firebase.auth().currentUser;

    this.newPet.userId = `${user.uid}`;
    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetails => {
      this.userName = userDetails['name'];
      this.newPet.userName = `${this.userName}`;

      this.userImage = userDetails['userImage'];
      this.newPet.userImage = `${this.userImage}`;
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

    this.petId = this.firestore.createId();

    const fileStoragePath = `pets/${this.userId}/${this.petId}/${new Date().getTime()}_${file.name}`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          this.newPet.petImage = resp;

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


  async submitNewPet(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.newPet.petId = this.petId;
    this.newPet.petBirthdate = this.addNewPet.get('petBirthdate').value;
    this.newPet.petBreed = this.addNewPet.get('petBreed').value;
    this.newPet.petBio = this.addNewPet.get('petBio').value;
    this.newPet.petGender = this.addNewPet.get('petGender').value;
    this.newPet.petName = this.addNewPet.get('petName').value;
    this.newPet.petHealthCondition = this.addNewPet.get('petHealthCondition').value;

    this.firestore.collection('pets').doc(this.newPet.userId)
    .collection('petDetails').doc(this.newPet.petId)
    .set(this.newPet).then(() => {
      loading.dismiss().then(() => {
        this.addNewPet = null;
        this.router.navigateByUrl('tab/location-tracker');
        });
      },
      error => {
       loading.dismiss().then(() => {
         console.error(error);
       });
    });
  }
}
