import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientMappingComponent } from './add-client-mapping.component';

describe('AddClientMappingComponent', () => {
  let component: AddClientMappingComponent;
  let fixture: ComponentFixture<AddClientMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClientMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClientMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
