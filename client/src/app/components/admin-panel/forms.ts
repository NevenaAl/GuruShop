const EditForm = `<form [formGroup]="addNewElementFormGroup" (submit)="submitAddForm()" *ngIf="addClicked"
class="adminPanel-wrapper__row">
<div>
  <ngx-dropzone [multiple]="type=='products'" [maxFileSize]="1000000000" accept="image/jpeg,image/jpg,image/png"
    class="image_dropzone" (change)="onSelect($event)">
    <ngx-dropzone-label>Drop your image here!</ngx-dropzone-label>
    <ngx-dropzone-image-preview ngProjectAs="ngx-dropzone-preview" *ngFor="let f of files" [file]="f"
      [removable]="true" (removed)="onRemove(f)">
      <ngx-dropzone-label>{{ f.name }} ({{ f.type }})</ngx-dropzone-label>
    </ngx-dropzone-image-preview>
  </ngx-dropzone>
  <p class="signUp-card__body__error">{{errorMessage}}</p>
</div>

<input class="adminPanel-wrapper__input" formControlName="name" [(ngModel)]="name" id="name" name="name" required
  type="text" placeholder="name">
<p class="signUp-card__body__error"
  *ngIf="addNewElementFormGroup.get('name').touched && addNewElementFormGroup.get('name').errors?.required">This
  field is required.</p>
<p class="signUp-card__body__error"
  *ngIf="addNewElementFormGroup.get('name').touched && addNewElementFormGroup.get('name').errors?.minlength">Minimum
  2 characters required.</p>
<select (change)="getSelectedCategory($event.target.value)" class="adminPanel-wrapper__input"
  *ngIf="type=='subcategories'">
  <option *ngFor="let category of categories" value="{{category._id}}">{{category.name}}</option>
</select>
<select (change)="getSelectedSubcategory($event.target.value)" class="adminPanel-wrapper__input"
  *ngIf="type=='products'">
  <option *ngFor="let subcategory of subcategories" value="{{subcategory._id}}">{{subcategory.name}}</option>
</select>
<input class="adminPanel-wrapper__addBtn" [disabled]="addNewElementFormGroup.invalid" type="submit"
  value="+ Add new">
</form>`

export {EditForm}