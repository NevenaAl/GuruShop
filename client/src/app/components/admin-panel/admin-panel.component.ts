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

  constructor(private route: ActivatedRoute, private apollo: Apollo,private categoriesService: CategoriesService, private http: HttpClient) { }

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
        this.loading = result.loading;
        this.error = result.error;
      });

  }

  loadProducts(){
    this.cardType = 'product';
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
    console.log(this.name);
    console.log(this.files[0]);

    // this.categoriesService.createCategory(this.name,this.files[0]) 
    // .subscribe(({ data }) => {
    //   console.log('got data', data);
    //   //this.payload = data;
    // });
    let formData:FormData = new FormData();
    formData.append('image', this.files[0],this.files[0].name);
    formData.append('name', this.name);
    let headers = new HttpHeaders();
    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    let options = { headers: headers };

    this.http.post("http://localhost:3000/categories", formData, options)
            .subscribe(
                data => console.log('success'),
                error => console.log(error)
            )

  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);

    const formData = new FormData();

    for (var i = 0; i < this.files.length; i++) {
      formData.append("file[]", this.files[i]);
    }
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

}
