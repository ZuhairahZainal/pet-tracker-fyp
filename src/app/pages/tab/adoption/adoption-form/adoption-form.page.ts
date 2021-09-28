import { Component, OnInit } from '@angular/core';

// firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';

// routing
import { ActivatedRoute, Router } from '@angular/router';

// taking picture
import { Camera, CameraResultType} from '@capacitor/camera';

// form validation
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-adoption-form',
  templateUrl: './adoption-form.page.html',
  styleUrls: ['./adoption-form.page.scss'],
})
export class AdoptionFormPage implements OnInit {
  newAdoptionList = {
    userId: '',
    userName: '',
    userEmail: '',
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

  newAdoptionForm: FormGroup;
  petId: string;
  userId: string;
  userName: string;
  userEmail: string;

  constructor(private firestore: AngularFirestore,
              private storage: AngularFireStorage,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.getUserId();
    this.getUserName();
    this.newAdoptionForm = new FormGroup({
      petAge: new FormControl(this.newAdoptionList.petAge,[
        Validators.required,
        Validators.min(0),
      ]),
      petBreed: new FormControl(this.newAdoptionList.petBreed,[
        Validators.required,
      ]),
      petCategory: new FormControl(this.newAdoptionList.petCategory,[
        Validators.required,
      ]),
      petCondition: new FormControl(this.newAdoptionList.petCondition,[
        Validators.required,
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

    this.petId = this.route.snapshot.params.petId || 'new';

    if (this.petId !== 'new'){
      this.firestore.doc(`adoptionList/${this.petId}`)
      .valueChanges()
      .subscribe((adoption: any) => (this.newAdoptionList = adoption));
    }
  }

  getUserId(){
    let user = firebase.auth().currentUser;

    this.newAdoptionList.userId = `${user.uid}`;
    this.userId = user.uid;
  }

  getUserName(){
    this.firestore.doc(`/users/${this.userId}`).valueChanges().subscribe(
      profile => {
        this.newAdoptionList.userName = profile['name'];
        this.newAdoptionList.userEmail = profile['email'];
      }
    )
  }

  savePost(): void{
    if(this.petId === 'new'){
      this.newAdoptionList.petAge = this.newAdoptionForm.get('petAge').value;
      this.newAdoptionList.petBreed = this.newAdoptionForm.get('petBreed').value;
      this.newAdoptionList.petCategory = this.newAdoptionForm.get('petCategory').value;
      this.newAdoptionList.petCondition = this.newAdoptionForm.get('petCondition').value;
      this.newAdoptionList.petDescription = this.newAdoptionForm.get('petDescription').value;
      this.newAdoptionList.petGender = this.newAdoptionForm.get('petGender').value;
      this.newAdoptionList.petName = this.newAdoptionForm.get('petName').value;
      this.newAdoptionList.petSpayStatus = this.newAdoptionForm.get('petSpayStatus').value;

      this.firestore.collection('adoptionList')
      .add(this.newAdoptionList).then(() => {
        this.newAdoptionForm = null;
        this.router.navigateByUrl('tab/adoption');
      });
    }else{
      this.firestore.doc(`adoptionList/${this.petId}`)
      .update(this.newAdoptionList)
      .then(() => {
        this.newAdoptionForm = null;
        this.router.navigateByUrl('tab/adoption');
      })
    }
  }

  async takePicture(): Promise<void>{
    try{
      const petImage = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });

      const petImageRef = this.storage.ref(
        `adoptionList/petImage/${new Date().getTime()}/petImage.png`
      );

      petImageRef.putString(petImage.base64String, 'base64', {
        contentType: 'image/png',
      })
      .then(() =>{
        petImageRef.getDownloadURL().subscribe(downloadURL => {
          this.newAdoptionList.petImage = downloadURL;
          console.log(this.newAdoptionList.petImage);
        })

      })
    }catch(error){
      console.warn(error);
    }
  }

  async addMedicalRecord(): Promise<void>{
    try{
      const petMedicalRecord = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });

      const petMedicalRecordRef = this.storage.ref(
        `adoptionList/petMedicalRecord/${new Date().getTime()}/petMedicalRecord.png`
      );

      petMedicalRecordRef.putString(petMedicalRecord.base64String, 'base64', {
        contentType: 'image/png',
      })
      .then(() =>{
        petMedicalRecordRef.getDownloadURL().subscribe(downloadURL => {
          this.newAdoptionList.petMedicalRecord = downloadURL;
          console.log(this.newAdoptionList);
        })

      })
    }catch(error){
      console.warn(error);
    }
  }

}
