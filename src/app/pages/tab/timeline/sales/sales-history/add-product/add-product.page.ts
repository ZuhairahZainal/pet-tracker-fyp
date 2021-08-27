import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { ProductService } from './../../shared/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  productForm: FormGroup;

  constructor(private productService: ProductService,
              private router: Router,
              private loadCtrl: LoadingController,
              public fb: FormBuilder) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productCategory: ['', Validators.required],
      productPrice: ['', Validators.required],
      productDescription: ['', Validators.required],
      productImage: [null]
    })
  }

  //submit form, send data to database
  formSubmit() {
    if (!this.productForm.valid) {
      return false;
    } else {
      this.productService.createProduct(this.productForm.value).then(res => {
        console.log(res)
        this.productForm.reset();
        this.router.navigate(['./sales/sales-history']);
      })
        .catch(error => console.log(error));
    }
  }

}
