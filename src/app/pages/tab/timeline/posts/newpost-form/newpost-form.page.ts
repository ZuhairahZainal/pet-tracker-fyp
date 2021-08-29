import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newpost-form',
  templateUrl: './newpost-form.page.html',
  styleUrls: ['./newpost-form.page.scss'],
})
export class NewpostFormPage implements OnInit {

  yourImageDataURL: any;
  newpostForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private firebaseData: AngularFirestore,
              private router: Router,
              ) { }

  ngOnInit() {
    this.newpostForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.maxLength(45)])],
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

  savePost(title, description) {
    return this.firebaseData.collection('newPost')
      .add({
        title: title,
        description: description
      });
  }


  onSubmit(){
    if (!this.newpostForm.valid){
      console.log("Nice try!");
    } else {
      this.savePost(this.newpostForm.value.title, this.newpostForm.value.description).then( () => {
          this.newpostForm.reset();
          this.router.navigateByUrl('tab/timeline');
        });
    }
  }


}
