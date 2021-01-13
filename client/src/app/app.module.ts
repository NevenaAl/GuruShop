import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductsComponent } from './components/products/products.component';
import { SubcategoriesComponent } from './components/subcategories/subcategories.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import {APOLLO_OPTIONS } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { CategoryComponent } from './components/category/category.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { SubcategoryDetailsComponent } from './components/subcategory-details/subcategory-details.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { ProductComponent } from './components/product/product.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CategoriesService } from './services/categories.service';
import { SimpleModalModule } from 'ngx-simple-modal';
import { ModalComponentComponent } from './components/modal-component/modal-component.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    HeaderComponent,
    HomeComponent,
    CategoriesComponent,
    ProductsComponent,
    SubcategoriesComponent,
    SignUpComponent,
    LogInComponent,
    CategoryComponent,
    CategoryDetailsComponent,
    SubcategoryDetailsComponent,
    ProductDetailsComponent,
    ProductComponent,
    AdminPanelComponent,
    ModalComponentComponent,
    UserDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule, 
    HttpClientModule,
    HttpLinkModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    SimpleModalModule.forRoot({container:document.body})
  ],
  entryComponents: [
    ModalComponentComponent
  ],
  providers: [
    UserService,
    CategoriesService,
    {
    provide: APOLLO_OPTIONS,
    useFactory: (httpLink: HttpLink) => {
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: "http://localhost:3000/graphql",
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      }
    },
    deps: [HttpLink]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
