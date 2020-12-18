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
  addClicked: boolean = false;
  categories: Array<Category>;
  subcategories: Array<Subcategory>;
  products: Array<Product>;
  selectedCategory: any;
  selectedSubcategory: any;
  loggedUser: Observable<User>;

  constructor(private userService: UserService, private route: ActivatedRoute, private apollo: Apollo, private categoriesService: CategoriesService, private subcategoriesService: SubcategoriesService, private productsService: ProductsService) { }

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
          this.cardType = 'product;'
        }

      })

    this.loadCategories();
    this.loadSubcategories();
    this.loadProducts();

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
    if (this.type == "categories") {
      this.categoriesService.createCategory(this.name, this.files[0])
        .subscribe(({ data }) => {
          console.log('got data', data);
          this.loadCategories();
        });
    } else if (this.type == "subcategories") {
      this.subcategoriesService.createSubcategory(this.name, this.files[0], this.selectedCategory)
        .subscribe(({ data }) => {
          console.log('got data', data);
          this.loadSubcategories();
        });
    } else {
      this.productsService.createProduct(this.name, this.files, this.selectedSubcategory)
        .subscribe(({ data }) => {
          console.log('got data', data);
          this.loadProducts();
        });
    }
    this.addClicked = false;
  }

  deleteClick(event) {
    let text;
    if (this.type == 'categories') {
      text = "This category and it's subcategories and products will be deleted";
    } else if (this.type == 'subcategories') {
      text = 'This subcategory and its products will be deleted';
      this.deleteSubcategory(event);
    } else if (this.type == 'products') {
      text = 'This product will be deleted';
      this.deleteProduct(event);
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

  editCategory(_id: String){
    // this.categoriesService.editCategory(_id)
    // .subscribe(({ data }) => {
    //   console.log('got data', data);
    //   this.loadCategories();
    // });
  }

  editSubcategory(_id: String){
    // this.subcategoriesService.editSubcategory(_id)
    // .subscribe(({ data }) => {
    //   console.log('got data', data);
    //   this.loadSubcategories();
    // });
  }

  editProduct(_id: String){
    // this.productsService.editProduct(_id)
    // .subscribe(({ data }) => {
    //   console.log('got data', data);
    //   this.loadProducts();
    // });
  }

  editClick(event) {
    Swal.fire({
      title: 'Edit',
      showCancelButton: true,
      confirmButtonText: 'Edit',
      cancelButtonText: 'Cancel',
      html: "<p>blaa</p>"
    }).then((result => {
      if (result.value) {
        if (this.type == 'categories') {
          this.editCategory(event);
        } else if (this.type == 'subcategories') {
          this.editSubcategory(event);
        } else if (this.type == 'products') {
          this.editProduct(event);
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

  onSelect(event) {
    if(this.type!='products'){
      this.files = [];
    }
    this.files.push(...event.addedFiles);

    const formData = new FormData();
    
    for (var i = 0; i < this.files.length; i++) {
      formData.append("file[]", this.files[i]);
    }
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  getSelectedCategory(event) {
    this.selectedCategory = event;
  }

  getSelectedSubcategory(event) {
    this.selectedSubcategory = event;
  }
}
