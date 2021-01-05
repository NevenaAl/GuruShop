import { Component, EventEmitter, Input, OnInit,Output } from '@angular/core';
import { Subcategory } from 'src/app/entities/Subcategory';
import { User } from 'src/app/entities/User';
import { UserService } from 'src/app/services/user.service';
import {Category} from '../../entities/Category';
import Swal from 'sweetalert2';
import * as query from '../../../strings/queries';
import {Observable} from 'rxjs';
import { CategoriesService } from 'src/app/services/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories.service';
import { ModalComponentComponent } from '../modal-component/modal-component.component';
import { SimpleModalService } from 'ngx-simple-modal';
import { Apollo } from 'apollo-angular';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {

  @Output() refreshCategories: EventEmitter<any> = new EventEmitter<any>();
  @Input() category : any;
  @Input() type: string;
  loggedUser: Observable<User>;

  constructor(private apollo: Apollo,private simpleModalService:SimpleModalService,private userService: UserService,private categoriesService: CategoriesService,private subcategoriesService: SubcategoriesService) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedUser();
  }

  editClick(event) {
    let disposable = this.simpleModalService.addModal(ModalComponentComponent, {
          title: 'Edit '+this.type,
          elementType: this.type,
          element: event
        })
        .subscribe((newValues)=>{
          if(newValues){
            if(this.type=="category"){
              this.editCategory(event,newValues);
            }
            if(this.type=="subcategory"){
              console.log(newValues);
              this.editSubcategory(event,newValues);
            }
          }
        });
  }

  deleteClick(event) {
    let text;
    if (this.type == 'category') {
      text = "This category and it's subcategories and products will be deleted";
    } else if (this.type == 'subcategory') {
      text = 'This subcategory and its products will be deleted';
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
        if (this.type == 'category') {
          this.deleteCategory(event);
        } else if (this.type == 'subcategory') {
          this.deleteSubcategory(event);
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
        this.refreshCategories.emit();
      });

  }

  deleteSubcategory(_id: String) {
    this.subcategoriesService.deleteSubcategory(_id)
      .subscribe(({ data }) => {
        console.log('got data', data);
        this.refreshCategories.emit();
      });
  }

  editCategory(category,newValues){
    for(let i in newValues){
      if(category[i]==newValues[i])
        newValues[i]=null
    }
    if(newValues.newImages.length==0){
      newValues.newImages=null;
    }else{
      newValues.newImages = newValues.newImages[0];
    }

    this.categoriesService.editCategory(category._id,newValues.name,newValues.newImages)
    .subscribe(({ data }) => {
      console.log('got data', data);
      this.refreshCategories.emit();
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
      this.refreshCategories.emit();
    });
  }

  
}

