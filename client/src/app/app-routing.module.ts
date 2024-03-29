import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SubcategoriesComponent } from './components/subcategories/subcategories.component';
import { SubcategoryDetailsComponent } from './components/subcategory-details/subcategory-details.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { UnauthenticatedGuard } from './guards/unauthenticated.guard';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "adminPanel/:type",
    component :AdminPanelComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "signUp",
    component: SignUpComponent,
    canActivate: [UnauthenticatedGuard]
  },
  {
    path: "userDetails",
    component: UserDetailsComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: "productDetails/:productId",
    component: ProductDetailsComponent
  },
  {
    path: "logIn",
    children:[
      {path : "", component: LogInComponent, canActivate: [UnauthenticatedGuard]},
      {path : ":confirm", component: LogInComponent, canActivate: [UnauthenticatedGuard]}
    ]
  },
  {
    path: "categories",
    children: [
      { path: "", component: CategoriesComponent },
      { path: ":categoryId", component: CategoryDetailsComponent },
      { path: ":categoryId/:subcategoryId", component: SubcategoryDetailsComponent }
    ]
  },
  {
    path: "products",
    children: [
      {path : ":subcategoryId", component: SubcategoryDetailsComponent }
    ]
  },
  {
    path: "subcategories",
    component: SubcategoriesComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
