import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-donate-form',
  templateUrl: './donate-form.page.html',
  styleUrls: ['./donate-form.page.scss'],
})
export class DonateFormPage implements OnInit {

  donationForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private firebaseData: AngularFirestore,
              private router: Router,
              private userService: UserService
             ) { }

  ngOnInit() {

    this.donationForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.maxLength(45)])],
      donationType: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    });
  }

  savePost(title, donationType, description) {
    return this.firebaseData.collection('donationPost')
      .add({
        title: title,
        donationType: donationType,
        description: description
      });
  }

  onSubmit(){
    if (!this.donationForm.valid){
      console.log("Nice try!");
    } else {
      this.savePost(this.donationForm.value.title, this.donationForm.value.donationType, this.donationForm.value.description).then( () => {
          this.donationForm.reset();
          this.router.navigateByUrl('tab/timeline');
        });
    }
  }

}
