import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { SimpleModalComponent } from "ngx-simple-modal";
import { Category } from 'src/app/entities/Category';
import * as query from '../../../strings/queries';

export interface PromptModel {
  title:string;
  elementType: String;
  element:object;
}

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html'
})
export class ModalComponentComponent extends SimpleModalComponent<PromptModel, object> implements PromptModel,OnInit {

  title: string;
  elementType: String;
  element: any;
  categories: any;
  subcategories: any;
  files: File[] = [];
  addNewElementFormGroup: FormGroup; 
  selectedCategory: any = null;
  selectedSubcategory: any = null;
  selectedRole: any = null;
  errorMessage: String="";
  images: String[] = [];
  deletedImages: String ="";
  showNgxDropzone = false;
  roles: String[] = ["admin","user"];
  
  constructor(private formBuilder: FormBuilder,private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    //@ts-ignore
    if(this.elementType!="users"){
      //@ts-ignore
      this.images =this.element.image.split(',').filter(x=> !!x);
    }

    this.loadCategories();
    this.loadSubcategories();
  }

  onSave() {
    if(this.files.length==0 && this.images.length==0 && this.elementType!="users" ){
      this.errorMessage = "Image is required!";
      return;
    }
    this.result ={
      deletedImages: this.deletedImages,
      newImages: this.files,
      name: this.addNewElementFormGroup.controls.name.value,
      description: this.addNewElementFormGroup.controls.description.value,
      discount: this.addNewElementFormGroup.controls.discount.value || 0,
      amount: this.addNewElementFormGroup.controls.amount.value,
      price: this.addNewElementFormGroup.controls.price.value,
      surrname: this.addNewElementFormGroup.controls.surrname.value,
      email: this.addNewElementFormGroup.controls.email.value,
      newSelectedCategory: this.selectedCategory,
      newSelectedSubcategory: this.selectedSubcategory,
      newSelectedRole : this.selectedRole
    }
    this.close();
  }
  
  onCancel(){
    this.result =null;
    this.close();
  }

  deleteImage(image){
    this.showNgxDropzone = true;
    this.images.forEach((element,index)=>{
      if(element==image) {
        this.images.splice(index,1);
        this.deletedImages+=image + ',';
      }
   });
  }

  createForm() {
    this.addNewElementFormGroup = this.formBuilder.group({
      name: [this.element.name, [Validators.required, Validators.minLength(2)]],
      surrname: [this.element.surrname || '',this.elementType=="users"? [Validators.required, Validators.minLength(2)]:[]],
      email: [this.element.email || '', this.elementType=="users"? [Validators.required, Validators.minLength(2)]: []],
      description: [this.element.description || '',this.elementType=="product"? [Validators.required,Validators.minLength(10)]: []],
      price: [this.element.price || null,this.elementType=="product"? [Validators.required]:[]],
      amount: [this.element.amount || null,this.elementType=="product"? [Validators.required]:[]],
      discount: [this.element.discount || null]
    
    });
  }

  onFileSelect(event) {
    if(this.elementType!='product'){
      this.files = [];
    }
    this.files.push(...event.addedFiles);
    this.errorMessage ="";
  }

  onFileRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  getSelectedCategory(event) {
    this.selectedCategory = event;
  }

  getSelectedSubcategory(event) {
    this.selectedSubcategory = event;
  }

  getSelectedRole(event) {
    this.selectedRole = event;
  }

  loadCategories() {
    this.apollo
      .watchQuery({
        query: query.CategoriesQuery,
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.categories = result.data.categories;
        // this.selectedCategory = this.categories[0]._id;
        // this.loading = result.loading;
        // this.error = result.error;
      });
  }

  loadSubcategories() {
    this.apollo
      .watchQuery({
        query: query.SubcategoriesQuery,
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.subcategories = result.data.subcategories;
        // this.selectedSubcategory = this.subcategories[0]._id;
        // this.filteredSubcategories = this.subcategories;
        // this.loading = result.loading;
        // this.error = result.error;
      });

  }
}
