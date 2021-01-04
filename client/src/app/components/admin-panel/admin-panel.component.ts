import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {RequestOptions} from '@angular/http'
import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Category } from 'src/app/entities/Category';
import { Product } from 'src/app/entities/Product';
import { Subcategory } from 'src/app/entities/Subcategory';
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
import { EventEmitter } from 'events';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html'
})

export class AdminPanelComponent implements OnInit {
  
  addNewElementFormGroup: FormGroup;
  files: File[] = [];
  name: string;
  type: String;
  cardType: String ="";
  loading: boolean;
  error: any;
  addClicked: boolean = false;
  categories: Array<Category>;
  subcategories: Array<Subcategory>;
  filteredSubcategories: Array<Subcategory> = new Array<Subcategory>();
  products: Array<Product>;
  users: Array<User>;
  selectedCategory: any;
  selectedSubcategory: any;
  loggedUser: Observable<User>;
  errorMessage: String="";

  constructor(private userService: UserService, private route: ActivatedRoute, private apollo: Apollo, 
     private categoriesService: CategoriesService, private subcategoriesService: SubcategoriesService,
     private productsService: ProductsService,private formBuilder: FormBuilder) { }

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

  submitAddForm() {
    if(this.files.length==0){
      this.errorMessage = "Image is required!";
      return;
    }
    this.errorMessage = "";
    if (this.type == "categories") {
      this.categoriesService.createCategory(this.name, this.files[0])
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
            this.name = "";
            this.createForm();
            this.files = [];
            this.loadCategories();
           } 
        });
    } else if (this.type == "subcategories") {
      this.subcategoriesService.createSubcategory(this.name, this.files[0], this.selectedCategory)
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
            this.name = "";
            this.createForm();
            this.files = [];
            this.selectedCategory = this.categories[0]._id;
            this.loadSubcategories();
           } 
        });
    } else {
      this.productsService.createProduct(this.name, this.files, this.selectedSubcategory)
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
            this.name = "";
            this.createForm();
            this.files = [];
            this.selectedSubcategory = this.subcategories[0]._id;
            this.loadProducts();
           } 
        });
    }
  }

  deleteUser(_id: String) {
    this.userService.deleteUser(_id)
      .subscribe(({ data }) => {
        console.log('got data', data);
        this.loadUsers();
      });
  }

  editUser(user, newValues){
    if(user.name==newValues.newName){
      newValues.newName=null;
    }
    if(user.surrname==newValues.newSurrname){
      newValues.newSurrname=null;
    }

    if(user.email==newValues.newEmail){
      newValues.newEmail=null;
    }

    this.userService.editUser(user._id,newValues.newName,newValues.newSurrname, newValues.newEmail,newValues.newSelectedRole)
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
    this.selectedCategory = event;
    this.filteredSubcategories = this.categories.find(x=>x._id==this.selectedCategory).subcategories;
  }

  getSelectedSubcategory(event) {
    this.selectedSubcategory = event;
  }
}
