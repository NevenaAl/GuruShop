import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/entities/User';
import { UserService } from 'src/app/services/user.service';
import * as query from '../../../strings/queries';
@Component({
	selector: 'app-side-bar',
	templateUrl: './side-bar.component.html'
})
export class SideBarComponent implements OnInit {

	hoveredCategory : any;
	categories: Array<any>;
	loggedUser: Observable<User>;
	role: String = "";
	sidenav: any;
	
	constructor(private userService: UserService, private apollo: Apollo) { }

	ngOnInit(): void {
		this.loggedUser = this.userService.getLoggedUser();
		this.loadCategories();
		this.userService.getLoggedUser().subscribe(res=>{
			if(res ==null){
				return;
			}
			this.role = res.role;
		});
	 
		this.sidenav = document.getElementById("sidenav") as HTMLElement;
		this.sidenav.style.width = "0px";
	}

	onShowSideBar(){
		this.sidenav.style.width =  this.sidenav.style.width =="13vw" ? "0px" : "13vw";
	}

	leaveHoverEvent(){
		this.hoveredCategory = null;
	}
	categoryHoverEvent(category){
		this.hoveredCategory =  category;
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
			});
	}
}
