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
import { AnyTxtRecord } from 'dns';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html'
})

export class AdminPanelComponent implements OnInit {
  files: File[] = [];
  name: string;
  type: String;
  cardType: String;
  loading: boolean;
  error: any;
  addClicked: boolean= false;
  categories: Array<Category>;
  subcategories: Array<Subcategory>;
  products: Array<Product>;
  selectedCategory : any;
  selectedSubcategory : any;

  constructor(private route: ActivatedRoute, private apollo: Apollo,private categoriesService: CategoriesService, private subcategoriesService: SubcategoriesService, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.type = params['type'];
        if (this.type == "categories") {
          this.cardType = 'category';
        } else if (this.type == "subcategories") {
          this.cardType = 'subcategory';
        } else {
          this.cardType = 'product;'
        }

      })
  
    this.loadCategories();
    this.loadSubcategories();
    this.loadProducts();

  }

  loadCategories(){
  this.apollo
      .watchQuery({
        query: query.CategoriesQuery
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.categories = result.data.categories;
        this.selectedCategory = this.categories[0]._id;
        this.loading = result.loading;
        this.error = result.error;
      });
  }

  loadSubcategories(){
     this.apollo
      .watchQuery({
        query: query.SubcategoriesQuery
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.subcategories = result.data.subcategories;
        this.selectedSubcategory = this.subcategories[0]._id;
        this.loading = result.loading;
        this.error = result.error;
      });

  }

  loadProducts(){
    this.apollo
      .watchQuery({
        query: query.ProductsQuery
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.products = result.data.products;
        this.loading = result.loading;
        this.error = result.error;
      });
  }

  showForm(){
    console.log(this.cardType);
    this.addClicked = true;
  }

  submit(){
    if (this.type == "categories") {
      this.categoriesService.createCategory(this.name, this.files[0]) 
      .subscribe(({ data }) => {
         console.log('got data', data);
      });
    } else if (this.type == "subcategories") {
      this.subcategoriesService.createSubcategory(this.name, this.files[0],this.selectedCategory) 
      .subscribe(({ data }) => {
         console.log('got data', data);
      });
    } else {
      this.productsService.createProduct(this.name, this.files,this.selectedSubcategory) 
      .subscribe(({ data }) => {
         console.log('got data', data);
      });
    }
   
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);

    const formData = new FormData();

    for (var i = 0; i < this.files.length; i++) {
      formData.append("file[]", this.files[i]);
    }
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }
  getSelectedCategory(event){
    this.selectedCategory = event;
  }
}
