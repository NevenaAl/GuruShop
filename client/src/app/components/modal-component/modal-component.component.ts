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
  addNewElementFormGroup: FormGroup;
  files: File[] = [];
  name: string;
  selectedCategory: any;
  selectedSubcategory: any;
  errorMessage: String="";
  
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    //@ts-ignore
    this.name = this.element.name;
    //@ts-ignore
    console.log(this.element.category._id);
  }

  onSave() {
    this.result = new Array;
    this.close();
  }
  
  onCancel(){
    this.result =null;
    this.close();
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

    const formData = new FormData();
    
    for (var i = 0; i < this.files.length; i++) {
      formData.append("file[]", this.files[i]);
    }
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

  submitAddForm() {}
}
