import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ProductService } from '../../../../../../services/sales/product.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {

  newProductList = {
    productName: '',
    productCategory: '',
    productPrice: '',
    productDescription: '',
    productAgreement: '',
    productImage: null
  }

  updateProductForm: FormGroup;
  productId: any;

  constructor(private pdtService: ProductService,
              private actRoute: ActivatedRoute,
              private firestore: AngularFirestore,
              public fb: FormBuilder) {

                this.productId = this.actRoute.snapshot.paramMap.get('productId');

                this.firestore.doc(`productList/${this.productId}`)
                .valueChanges()
                .subscribe((products: any) => (this.newProductList = products));
  }

  ngOnInit() {
    this.updateProductForm = this.fb.group({
      productName: [''],
      productCategory: [''],
      productPrice: [''],
      productDescription: [''],
      productAgreement: [''],
    })
  }

  //update form for changes
  updateForm() {
    this.pdtService.updateProduct(this.productId, this.updateProductForm.value)
  }
}

