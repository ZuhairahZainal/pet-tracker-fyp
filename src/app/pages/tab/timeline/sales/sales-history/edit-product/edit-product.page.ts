import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ProductService } from './../../shared/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {

  updateProductForm: FormGroup;
  productId: any;

  constructor(private pdtService: ProductService,
    private actRoute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder) {
      this.productId = this.actRoute.snapshot.paramMap.get('productId');
      this.pdtService.getProduct(this.productId).valueChanges().subscribe(res => {
      this.updateProductForm.setValue(res);
    });
  }


  ngOnInit() {
    this.updateProductForm = this.fb.group({
      productName: [''],
      productCategory: [''],
      productPrice: [''],
      productDescription: [''],
      productImage: ['']
    })
    console.log(this.updateProductForm.value)
  }

  //update form for changes
  updateForm() {
    this.pdtService.updateProduct(this.productId, this.updateProductForm.value)
      .then(() => {
        this.router.navigate(['tab/timeline/sales/sales-history']);
      })
      .catch(error => console.log(error));
  }

}

