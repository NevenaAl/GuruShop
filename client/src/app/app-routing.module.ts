import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { NotauthorizedComponent } from './components/notauthorized/notauthorized.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SubcategoriesComponent } from './components/subcategories/subcategories.component';
import { SubcategoryDetailsComponent } from './components/subcategory-details/subcategory-details.component';
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
    path: "notauthorized",
    component: NotauthorizedComponent
  },
  {
    path: "signUp",
    component: SignUpComponent,
    canActivate: [UnauthenticatedGuard]
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
