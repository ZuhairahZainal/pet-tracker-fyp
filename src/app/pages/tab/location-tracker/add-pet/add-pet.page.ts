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

  value: any;

  newPetDetails ={
    time: new Date().getTime(),
    date: new Date().toDateString(),
    userImage: '',
    userName: '',
    petName: '',
    petBreed: '',
    petCategory: '',
    petCondition: '',
    petGender: '',
    petBirthdate: '',
    petImage: null,
    petId:'',
  };

  userId: string;
  userName: string;
  userImage: string;

  petId: any;
  petName: any;
  petBreed: any;
  petGender: any;
  petHealthCondition: any;
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

      this.newPetDetails.petId= this.firestore.createId();
  }

  ngOnInit() {
    this.getUserId();
    this.updatePetProfile = new FormGroup({
      petBirthdate: new FormControl(this.newPetDetails.petBirthdate,[
        Validators.required
      ]),
      petBreed: new FormControl(this.newPetDetails.petBreed,[
        Validators.required,
        Validators.minLength(2),
      ]),
      petCategory: new FormControl(this.newPetDetails.petCategory,[
        Validators.required,
        Validators.minLength(5)
      ]),
      petCondition: new FormControl(this.newPetDetails.petCondition,[
        Validators.required,
        Validators.minLength(2),
      ]),
      petGender: new FormControl(this.newPetDetails.petGender,[
        Validators.required,
      ]),
      petName: new FormControl(this.newPetDetails.petName,[
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
      this.newPetDetails.userName = `${this.userName}`;

      this.userImage = userDetails['userImage'];
      this.newPetDetails.userImage = `${this.userImage}`;
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

    const fileStoragePath = `pets/${this.userId}/${this.newPetDetails.petId}/petImage`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
           this.newPetDetails.petImage = resp;

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

  async submitUpdate(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.newPetDetails.petName= this.updatePetProfile.get('petName').value;
    this.newPetDetails.petCategory= this.updatePetProfile.get('petCategory').value;
    this.newPetDetails.petGender= this.updatePetProfile.get('petGender').value;
    this.newPetDetails.petBreed=this.updatePetProfile.get('petBreed').value;
    this.newPetDetails.petBirthdate=this.updatePetProfile.get('petBirthdate').value;
    this.newPetDetails.petCondition=this.updatePetProfile.get('petCondition').value;

  this.firestore.collection('users').doc(this.userId).collection('newPetProfile').doc(this.newPetDetails.petId).set(this.newPetDetails).then(() =>{

    loading.dismiss().then(() => {
      this.updatePetProfile= null;// Clears all input
      this.router.navigateByUrl('/tab/location-tracker');// Direct to pet display
      console.log('Added new pet info!');// Message
     });
    },
    error => {
     loading.dismiss().then(() => {
       console.error(error);
     });
  });
}

  resetDetails(){
    this.updatePetProfile.reset();
  }
}
