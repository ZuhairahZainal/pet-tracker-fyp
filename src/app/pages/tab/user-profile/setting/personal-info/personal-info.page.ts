import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import firebase from 'firebase/app';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
})
export class PersonalInfoPage implements OnInit {

  newUserDetail = {
    name: '',
    email: '',
    phone: '',
    userImage: null,
    userBio: null
  }

  updateUserDetail: FormGroup;
  userId: any;
  userInfo: any;
  userDetails;

  userUsername: any;
  userFirstName: any;
  userLastName: any;
  userDOB: any;
  userPhone: any;
  userEmail: any;

  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

      this.setUserId();

      this.firestore.doc(`/users/${this.userId}`).valueChanges().subscribe(
        profile => {
          console.log('Profile:', profile);
          this.userUsername = profile['name'];
          this.userFirstName = profile['firstname'];
          this.userLastName = profile['lastname'];
          this.userDOB = profile['dob'];
          this.userPhone = profile['phone'];
          this.userEmail = profile['email'];
        }
      )

    }

  ngOnInit(){
    this.updateUserDetail = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      userBio: ['']
    })
  }

  setUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
    console.log(user.uid);
  }


  updateForm() {
    this.updateProduct(this.userId, this.updateUserDetail.value);
  }

  updateProduct(userId, users) {
    this.firestore.collection('users').doc(userId).update(users)
    .then(() => {
      this.takePicture;
      // this.router.navigate(['tab/user-profile']);
    }).catch(error => console.log(error));
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
          console.log(this.newUserDetail.userImage);
        })

        this.newUserDetail.userImage.unsubsribe();

      })
    }catch(error){
      console.warn(error);
    }
  }
}
