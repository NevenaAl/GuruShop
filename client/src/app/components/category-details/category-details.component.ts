import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Category } from 'src/app/entities/Category';
import { CategoryService} from '../../services/category.service'

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html'
})
export class CategoryDetailsComponent implements OnInit {
  category: Category;
  categoryId : string;
  loading : boolean;
  error : String;

  constructor(private route: ActivatedRoute,private categoryService: CategoryService ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) =>{
        this.categoryId = params['id'];
        this.categoryService.getCategory(this.categoryId)
        .valueChanges.subscribe(result => {
          //@ts-ignore
          this.category = result.data.categories;
          this.loading = result.loading;
          this.error = result.error;
          console.log(this.category);
        });
      }
    ); 
  }

}
