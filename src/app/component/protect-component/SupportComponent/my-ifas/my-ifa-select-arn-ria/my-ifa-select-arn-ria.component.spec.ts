import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyIfaSelectArnRiaComponent } from './my-ifa-select-arn-ria.component';

describe('MyIfaSelectArnRiaComponent', () => {
  let component: MyIfaSelectArnRiaComponent;
  let fixture: ComponentFixture<MyIfaSelectArnRiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyIfaSelectArnRiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyIfaSelectArnRiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
