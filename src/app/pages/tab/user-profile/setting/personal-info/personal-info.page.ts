import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
})
export class PersonalInfoPage implements OnInit {

  updateUserInfoForm: FormGroup;

  constructor(public fb: FormBuilder) { }

  ngOnInit() {
    this.updateUserInfoForm = this.fb.group({
      userame: [''],
      aboutMe: [''],
      emailAddress: [''],
      phoneNumber: [''],
    })
    console.log(this.updateUserInfoForm.value)
  }

  updateForm() {
    // this.pdtService.updateProduct(this.productId, this.updateProductForm.value)
    //   .then(() => {
    //     this.router.navigate(['tab/timeline/sales/sales-history']);
    //   })
    //   .catch(error => console.log(error));
  }


}
