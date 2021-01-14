import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {RequestOptions} from '@angular/http'
import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Category } from 'src/app/entities/Category';
import { Product } from 'src/app/entities/Product';
import { Subcategory } from 'src/app/entities/Subcategory';
import {InputModel} from 'src/app/entities/Input';
import { CategoriesService } from 'src/app/services/categories.service';
import * as query from '../../../strings/queries';
import * as mutaions from '../../../strings/mutations'
import { SubcategoriesService } from 'src/app/services/subcategories.service';
import { ProductsService } from 'src/app/services/products.service';
import { Observable } from 'rxjs'
import { User } from 'src/app/entities/User';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleModalService } from "ngx-simple-modal";
import { ModalComponentComponent } from '../modal-component/modal-component.component'
import {InputTypes} from '../../../strings/enums'

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html'
})

export class AdminPanelComponent implements OnInit {
  
  addNewElementFormGroup: FormGroup;
  addNewInputFormGroup : FormGroup;
  files: File[] = [];
  type: String;
  cardType: String ="";
  loading: boolean;
  error: any;
  addClicked: boolean = false;
  addInputClicked: boolean = false;
  categories: Array<Category>;
  subcategories: Array<Subcategory>;
  filteredSubcategories: Array<Subcategory> = new Array<Subcategory>();
  products: Array<Product>;
  users: Array<User>;
  selectedCategory: any;
  selectedSubcategory: any;
  loggedUser: Observable<User>;
  errorMessage: String="";
  inputTypeListSelected = false;
  inputs = new Array<any>();
  inputValues = new Array<String>();
  inputValueError: String = "";
  productCategoryInputs = new Array<InputModel>();
  productSubcategoryInputs = new Array<InputModel>();
  myEnum = this.getENUM(InputTypes);


  constructor(private userService: UserService, private route: ActivatedRoute, private apollo: Apollo, 
     private categoriesService: CategoriesService, private subcategoriesService: SubcategoriesService,
     private productsService: ProductsService,private formBuilder: FormBuilder,
     private simpleModalService: SimpleModalService) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedUser();
    this.route.params.subscribe(
      (params: Params) => {
        this.addClicked=false;
        this.type = params['type'];
        if (this.type == "categories") {
          this.cardType = 'category';
        } else if (this.type == "subcategories") {
          this.cardType = 'subcategory';
        } else if (this.type == "products")  {
          this.cardType = 'product';
        }else if (this.type == "users")  {
          this.cardType = 'user';
        }

        this.createForm();
        this.filteredSubcategories = this.subcategories;
        this.inputs = [];
        this.addInputClicked = false;
      })

    this.loadCategories();
    this.loadSubcategories();
    this.loadProducts();
    this.loadUsers();

  }

  createForm() {
    this.addNewElementFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['',this.cardType=="product"? [Validators.required,Validators.minLength(10)]: []],
      categorySelection : [null, this.cardType=="subcategory"? [Validators.required]: []],
      subcategorySelection : [null,this.cardType=="product"? [Validators.required]: []],
      price: [null,this.cardType=="product"? [Validators.required]:[]],
      amount: [null,this.cardType=="product"? [Validators.required]:[]],
      discount: [null]
      
    });
  }

  createInputForm() {
    this.addNewInputFormGroup = this.formBuilder.group({
      inputName: ['', [Validators.required, Validators.minLength(2)]],
      inputTypeSelection : [null, [Validators.required]],
      inputListElement : ['',null],
      required: [null],
      searchable: [null]
    });
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
        this.selectedCategory = this.categories[0]._id;
        this.loading = result.loading;
        this.error = result.error;
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
        this.selectedSubcategory = this.subcategories[0]._id;
        this.filteredSubcategories = this.subcategories;
        this.loading = result.loading;
        this.error = result.error;
      });

  }

  loadProducts() {
    this.apollo
      .watchQuery({
        query: query.ProductsQuery,
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.products = result.data.products;
        this.loading = result.loading;
        this.error = result.error;
      });
  }

  loadUsers() {
    this.apollo
      .watchQuery({
        query: query.UsersQuery,
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.users = result.data.users;
        this.loading = result.loading;
        this.error = result.error;
      });
  }

  showAddForm() {
    this.addClicked = true;
  }

  showAddInputForm(){
    this.addInputClicked = true;
    this.createInputForm();
  }

  submitAddForm() {
    if(this.files.length==0){
      this.errorMessage = "Image is required!";
      return;
    }
    this.errorMessage = "";
    if (this.type == "categories") {
      this.categoriesService.createCategory(this.addNewElementFormGroup.controls.name.value, this.files[0],JSON.stringify(this.inputs))
        .subscribe(({ data }) => {
          console.log('got data', data);
          //@ts-ignore
          let error = data.createCategory.errors;
          if(error!=null){
           Swal.fire({
             title: 'Error',
             text: error[0].message,
              icon: 'warning'
            })
           }else{
            this.addClicked = false;
            this.inputs = [];
            this.createForm();
            this.files = [];
            this.loadCategories();
           } 
        });
    } else if (this.type == "subcategories") {
      this.subcategoriesService.createSubcategory(this.addNewElementFormGroup.controls.name.value, this.files[0], this.selectedCategory,JSON.stringify(this.inputs))
        .subscribe(({ data }) => {
          console.log('got data', data);
          //@ts-ignore
          let error = data.createSubcategory.errors;
          if(error!=null){
           Swal.fire({
             title: 'Error',
             text: error[0].message,
              icon: 'warning'
            })
           }else{
            this.addClicked = false;
            this.inputs = [];
            this.createForm();
            this.files = [];
            this.selectedCategory = this.categories[0]._id;
            this.loadSubcategories();
           } 
        });
    } else {
      this.productsService.createProduct(this.addNewElementFormGroup.controls.name.value, this.files, this.addNewElementFormGroup.controls.description.value, +this.addNewElementFormGroup.controls.price.value, +this.addNewElementFormGroup.controls.discount.value,+this.addNewElementFormGroup.controls.amount.value,null, this.selectedSubcategory)
        .subscribe(({ data }) => {
          console.log('got data', data);
          //@ts-ignore
          let error = data.createProduct.errors;
          if(error!=null){
           Swal.fire({
             title: 'Error',
             text: error[0].message,
              icon: 'warning'
            })
           }else{
            this.addClicked = false;
            this.createForm();
            this.files = [];
            this.selectedSubcategory = this.subcategories[0]._id;
            this.loadProducts();
           } 
        });
    }
  }

  submitAddInputForm(){
    if(this.inputTypeListSelected && this.inputValues.length==0){
      this.inputValueError = "Minimum 1 value required.";
      return;
    }
    let newInput = {
      inputValue: this.addNewInputFormGroup.controls.inputName.value,
      inputName: this.addNewInputFormGroup.controls.inputName.value,
      inputType: this.addNewInputFormGroup.controls.inputTypeSelection.value,
      inputList: this.inputTypeListSelected? this.inputValues:null,
      required: this.addNewInputFormGroup.controls.required.value ? true:false,
      searchable: this.addNewInputFormGroup.controls.searchable.value ? true:false,
    }

    this.inputs.push(newInput);

    this.addInputClicked = false;
    this.inputValueError="";
    this.inputValues =[];
    this.createInputForm();

  }

  addInputValue(){
    if(this.addNewInputFormGroup.controls.inputListElement.value.trim()!="")
       this.inputValues.push(this.addNewInputFormGroup.controls.inputListElement.value);
    this.addNewInputFormGroup.controls.inputListElement.reset();
  }

  deleteInputValueClick(value){
    this.inputValues = this.inputValues.filter(x=>x!=value);
  }
  
  deleteUser(_id: String) {
    this.userService.deleteUser(_id)
      .subscribe(({ data }) => {
        console.log('got data', data);
        this.loadUsers();
      });
  }

  editClick(event) {
    let disposable = this.simpleModalService.addModal(ModalComponentComponent, {
          title: 'Edit user',
          elementType: "users",
          element: event
        })
        .subscribe((newValues)=>{
          if(newValues){
            this.editUser(event,newValues);
          }
        });
  }
  
  editUser(user, newValues){
    for(let i in newValues){
      if(user[i]==newValues[i])
        newValues[i]=null
    }

    this.userService.editUser(user._id,newValues.name,newValues.surrname, newValues.email,newValues.newSelectedRole)
    .subscribe(({ data }) => {
      console.log('got data', data);
      this.loadUsers();
    });
  }

  onFileSelect(event) {
    if(this.type!='products'){
      this.files = [];
    }
    this.files.push(...event.addedFiles);

    this.errorMessage ="";
  }

  onFileRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  getSelectedCategory(event) {
    this.productCategoryInputs = [];
    this.selectedCategory = event;
    let category = this.categories.find(x=>x._id==this.selectedCategory);
    this.filteredSubcategories = category.subcategories;

    if(category.inputs){
        for(var input of JSON.parse(category.inputs)){           
          let newInput = new InputModel(input.inputName,input.inputValue,input.inputType,input.required,input.searchable,input.inputList);
          this.productCategoryInputs.push(newInput); 
      }
    }
  }

  getSelectedSubcategory(event) {
    this.productSubcategoryInputs = [];
    this.selectedSubcategory = event;
    let subcategory = this.subcategories.find(x=>x._id==this.selectedSubcategory);

    if(subcategory.inputs){
      for(var input of JSON.parse(subcategory.inputs)){           
        let newInput = new InputModel(input.inputName,input.inputValue,input.inputType,input.required,input.searchable,input.inputList);
        this.productSubcategoryInputs.push(newInput); 
      }
     }
    this.productSubcategoryInputs = this.productSubcategoryInputs.concat(this.productCategoryInputs);
  }

  getSelectedInputType(event){
    if(event=="DROPDOWN_LIST" || event=="CHECKBOX_LIST")
      this.inputTypeListSelected = true;
    else{
      this.inputValues =[];
      this.inputTypeListSelected= false;
    }
  }
  
  getENUM(ENUM:any): string[] {
    let myEnum = [];
    let objectEnum = Object.keys(ENUM);
    const values = objectEnum.slice( 0 , objectEnum.length / 2 );
    const keys = objectEnum.slice( objectEnum.length / 2 );

    for (let i = 0 ; i < objectEnum.length/2 ; i++ ) {
      myEnum.push( { key: keys[i], value: values[i] } ); 
    }
    return myEnum;
  }
}
