import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {RequestOptions} from '@angular/http'
import { Component, OnInit } from '@angular/core';
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
  selectedCategory: any;
  selectedSubcategory: any;
  loggedUser: Observable<User>;
  errorMessage: String="";

  constructor(private userService: UserService, private route: ActivatedRoute, private apollo: Apollo, 
     private categoriesService: CategoriesService, private subcategoriesService: SubcategoriesService,
     private productsService: ProductsService,private formBuilder: FormBuilder,
     private simpleModalService:SimpleModalService) { }

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
        } else {
          this.cardType = 'product';
        }

        this.createForm();
        this.filteredSubcategories = this.subcategories;
      })

    this.loadCategories();
    this.loadSubcategories();
    this.loadProducts();

  }

  editClick(event) {
    let disposable = this.simpleModalService.addModal(ModalComponentComponent, {
          title: 'Edit',
          elementType: this.type,
          element: event,
          categories: this.categories,
          subcategories: this.subcategories
        })
        .subscribe((newValues)=>{
          if(newValues){
            if(this.type=="categories"){
              this.editCategory(event,newValues);
            }
            if(this.type=="subcategories"){
              console.log(newValues);
              this.editSubcategory(event,newValues);
            }
            if(this.type=="products"){
              this.editProduct(event,newValues);
            }
          }
        });
  }

  createForm() {
    this.addNewElementFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      categorySelection : [null, this.cardType=="subcategory"? [Validators.required]: []],
      subcategorySelection : [null,this.cardType=="product"? [Validators.required]: []]
      
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
       // this.addNewElementFormGroup.controls.categorySelection.setValue(this.categories[0]._id || null);
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
        //this.addNewElementFormGroup.controls.subcategorySelection.setValue(this.filteredSubcategories[0]._id || null);
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

  deleteClick(event) {
    let text;
    if (this.type == 'categories') {
      text = "This category and it's subcategories and products will be deleted";
    } else if (this.type == 'subcategories') {
      text = 'This subcategory and its products will be deleted';
    } else if (this.type == 'products') {
      text = 'This product will be deleted';
    }
    Swal.fire({
      title: 'Are you sure?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result => {
      if (result.value) {
        if (this.type == 'categories') {
          this.deleteCategory(event);
        } else if (this.type == 'subcategories') {
          this.deleteSubcategory(event);
        } else if (this.type == 'products') {
          this.deleteProduct(event);
        }

        Swal.fire(
          'Deleted!'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled'
        )
      }
    }))

  }

  deleteCategory(_id: String) {
    this.categoriesService.deleteCategory(_id)
      .subscribe(({ data }) => {
        console.log('got data', data);
        this.loadCategories();
      });

  }

  deleteSubcategory(_id: String) {
    this.subcategoriesService.deleteSubcategory(_id)
      .subscribe(({ data }) => {
        console.log('got data', data);
        this.loadSubcategories();
      });
  }

  deleteProduct(_id: String) {
    this.productsService.deleteProduct(_id)
      .subscribe(({ data }) => {
        console.log('got data', data);
        this.loadProducts();
      });
  }

  editCategory(category,newValues){
    if(category.name==newValues.newName){
      newValues.newName=null;
    }
    if(newValues.newImages.length==0){
      newValues.newImages=null;
    }else{
      newValues.newImages = newValues.newImages[0];
    }

    this.categoriesService.editCategory(category._id,newValues.newName,newValues.newImages)
    .subscribe(({ data }) => {
      console.log('got data', data);
      this.loadCategories();
    });
  }

  editSubcategory(subcategory,newValues){
    if(subcategory.name==newValues.newName){
      newValues.newName=null;
    }
    if(newValues.newImages.length==0){
      newValues.newImages=null;
    }else{
      newValues.newImages = newValues.newImages[0];
    }

    this.subcategoriesService.editSubcategory(subcategory._id,newValues.newName,newValues.newImages,newValues.newSelectedCategory)
    .subscribe(({ data }) => {
      console.log('got data', data);
      this.loadSubcategories();
    });
  }

  editProduct(product, newValues){
    if(product.name==newValues.newName){
      newValues.newName=null;
    }
    if(newValues.newImages.length==0){
      newValues.newImages=null;
    }

    this.productsService.editProduct(product._id,newValues.newName,newValues.newImages, newValues.deletedImages,newValues.newSelectedSubcategory)
    .subscribe(({ data }) => {
      console.log('got data', data);
      this.loadProducts();
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
    console.log(this.filteredSubcategories);
  }

  getSelectedSubcategory(event) {
    this.selectedSubcategory = event;
  }
}
