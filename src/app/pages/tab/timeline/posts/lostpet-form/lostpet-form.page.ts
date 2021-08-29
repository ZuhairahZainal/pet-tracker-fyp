import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lostpet-form',
  templateUrl: './lostpet-form.page.html',
  styleUrls: ['./lostpet-form.page.scss'],
})
export class LostpetFormPage implements OnInit {

  yourImageDataURL: any;
  lostpetForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private firebaseData: AngularFirestore,
              private router: Router,
              ) { }

  ngOnInit() {
    this.lostpetForm = this.formBuilder.group({
      petname: ['', Validators.compose([Validators.required, Validators.maxLength(45)])],
      petgender: ['', Validators.compose([Validators.required])],
      petage: ['', Validators.compose([Validators.required, Validators.max(100)])],
      petcolor: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
      reward: [''],
      description: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    });
  }


  loadImageFromDevice(event){

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () =>{
      let blob: Blob = new Blob ([new Uint8Array((reader.result as ArrayBuffer))]);
      let blobURL: string = URL.createObjectURL(blob);
    };

    reader.onerror = (error) => {
      //handle errors
    };
  }

  savePost( petname, petgender, petage, petcolor, location, reward, description) {
    return this.firebaseData.collection('lostpetPost')
      .add({
        petname: petname,
        petgender:petgender,
        petage: petage,
        petcolor: petcolor,
        location: location,
        reward: reward,
        description: description
      });
  }


  onSubmit(){
    if (!this.lostpetForm.valid){
      console.log("Try Again!");
    } else {
      this.savePost(this.lostpetForm.value.petname,
                    this.lostpetForm.value.petgender,
                    this.lostpetForm.value.petage,
                    this.lostpetForm.value.petcolor,
                    this.lostpetForm.value.location,
                    this.lostpetForm.value.reward,
                    this.lostpetForm.value.description,).then( () => {
          this.lostpetForm.reset();
          this.router.navigateByUrl('tab/timeline');
        });
    }
  }


}
