import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryDetailsComponent } from './subcategory-details.component';

describe('SubcategoryDetailsComponent', () => {
  let component: SubcategoryDetailsComponent;
  let fixture: ComponentFixture<SubcategoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
