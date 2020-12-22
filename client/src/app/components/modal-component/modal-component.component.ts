import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleModalComponent } from "ngx-simple-modal";
import { Category } from 'src/app/entities/Category';

export interface PromptModel {
  title:string;
  elementType: String;
  element:object;
  categories: any;
  subcategories: any;
}

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html'
})
export class ModalComponentComponent extends SimpleModalComponent<PromptModel, object> implements PromptModel,OnInit {

  title: string;
  elementType: String;
  element: object;
  categories: any;
  subcategories: any;
  files: File[] = [];
  addNewElementFormGroup: FormGroup; 
  name: string;
  selectedCategory: any = null;
  selectedSubcategory: any = null;
  errorMessage: String="";
  image: String;
  showNgxDropzone = false;
  
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    //@ts-ignore
    this.name = this.element.name;
    //@ts-ignore
    this.image =this.element.image;
  }

  onSave() {
    this.result ={
      oldImages: this.image,
      newImages: this.files,
      newName: this.name,
      newSelectedCategory: this.selectedCategory,
      newSelectedSubcategory: this.selectedSubcategory
    }
    this.close();
  }
  
  onCancel(){
    this.result =null;
    this.close();
  }

  deleteImage(){
    this.showNgxDropzone = true;
    this.image = "";
  }

  createForm() {
    this.addNewElementFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    
    });
  }

  onFileSelect(event) {
    if(this.elementType!='products'){
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

}
