import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
})
export class PersonalInfoPage implements OnInit {

  userList = {
    dob: '',
    email: '',
    firstname: '',
    lastname: '',
    name: '',
    phone: '',
    userdp: null,
    aboutme: null,
  }

  updateUserInfoForm: FormGroup;
  userId: string;

  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(){
    this.firestore.doc(`users/${this.userId}`)
      .valueChanges()
      .subscribe((userDetail: any) => (this.userList = userDetail));
  }

  saveEdit(): void{
    this.firestore.doc(`users/${this.userId}`)
      .update(this.userList)
      .then(() => {
        this.updateUserInfoForm = null;
        this.router.navigateByUrl('tab/user-profile');
    })
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
          this.userList.userdp = downloadURL;
          console.log(this.userList);
        })

        this.userList.userdp.unsubsribe();

      })
    }catch(error){
      console.warn(error);
    }
  }
}
