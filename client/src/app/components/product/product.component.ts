import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/entities/Product';
import { User } from 'src/app/entities/User';
import { UserService } from 'src/app/services/user.service';
import {Observable} from 'rxjs';
import Swal from 'sweetalert2'
import { ProductsService } from 'src/app/services/products.service';
import { SimpleModalService } from 'ngx-simple-modal';
import { ModalComponentComponent } from '../modal-component/modal-component.component';
import { Category } from 'src/app/entities/Category';
import { Subcategory } from 'src/app/entities/Subcategory';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  @Output() refreshProducts: EventEmitter<any> = new EventEmitter<any>();
  @Input() product: Product;
  loggedUser: Observable<User>;
  categories: Array<Category>;
  subcategories: Array<Subcategory>;
  
  constructor(private userService: UserService,private productsService: ProductsService,private simpleModalService:SimpleModalService) { }

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedUser();
  }

  editClick(event) {
    console.log(event);
    let disposable = this.simpleModalService.addModal(ModalComponentComponent, {
          title: 'Edit product',
          elementType: "product",
          element: event
        })
        .subscribe((newValues)=>{
          if(newValues){
            this.editProduct(event,newValues);
          }
        });
  }

  deleteClick(event) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result => {
      if (result.value) {
       this.deleteProduct(event);
       
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

  deleteProduct(_id: String) {
    this.productsService.deleteProduct(_id)
      .subscribe(({ data }) => {
        console.log('got data', data);
        this.refreshProducts.emit();
      });
  }

  editProduct(product, newValues){
    console.log(newValues);
    for(let i in newValues){
      if(product[i]==newValues[i])
        newValues[i]=null;
    }
    
    if(newValues.newImages.length==0){
      newValues.newImages=null;
    }
    
    this.productsService.editProduct(product._id,newValues.name,newValues.newImages, newValues.deletedImages, newValues.description,newValues.price, newValues.discount,newValues.amount,null,newValues.newSelectedSubcategory)
    .subscribe(({ data }) => {
      console.log('got data', data);
      this.refreshProducts.emit();
    });
  }
}
