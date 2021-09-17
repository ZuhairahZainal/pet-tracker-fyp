import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ProductService } from './../../shared/product.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AngularFireStorage } from '@angular/fire/storage';
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
              private storage: AngularFireStorage,
              private firestore: AngularFirestore,
              private router: Router,
              public fb: FormBuilder) {
      // this.productId = this.actRoute.snapshot.paramMap.get('productId');

      // this.pdtService.getProduct(this.productId).valueChanges().subscribe(res => {
      // this.updateProductForm.setValue(res);
  }

  ngOnInit() {
    this.productId = this.actRoute.snapshot.params.productId;

    this.firestore.doc(`productList/${this.productId}`)
    .valueChanges()
    .subscribe((products: any) => (this.newProductList = products));

    this.updateProductForm = this.fb.group({
      productName: [''],
      productCategory: [''],
      productPrice: [''],
      productDescription: [''],
      productAgreement: [''],
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


  async takePicture(): Promise<void>{
    try{
      const productImage = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });

      const productImageRef = this.storage.ref(
        `productList/${new Date().getTime()}/productImage.png`
      );

      productImageRef.putString(productImage.base64String, 'base64', {
        contentType: 'image/png',
      })
      .then(() =>{
        productImageRef.getDownloadURL().subscribe(downloadURL => {
          this.newProductList.productImage = downloadURL;
          console.log(this.newProductList);
        })

        this.newProductList.productImage.unsubsribe();

      })
    }catch(error){
      console.warn(error);
    }
  }}

