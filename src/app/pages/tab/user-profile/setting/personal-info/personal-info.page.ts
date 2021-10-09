import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { LoadingController } from '@ionic/angular';
import firebase from 'firebase/app';

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

  async takePicture(): Promise<void>{
    try{
      const userdp = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });

      const userdpRef = this.storage.ref(
        `users/${this.userId}/image.png`
      );

      userdpRef.putString(userdp.base64String, 'base64', {
        contentType: 'image/png',
      })
      .then(() =>{
        userdpRef.getDownloadURL().subscribe(downloadURL => {
          this.newUserDetail.userImage = downloadURL;

          this.firestore.collection('users').doc(this.userId).update({
            userImage: this.newUserDetail.userImage
          })
          console.log(this.newUserDetail.userImage);
        });
      })
    }catch(error){
      console.warn(error);
    }
  }
}
