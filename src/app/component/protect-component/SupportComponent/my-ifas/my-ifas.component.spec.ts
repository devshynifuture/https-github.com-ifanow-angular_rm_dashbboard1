import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyIfasComponent } from './my-ifas.component';

describe('MyIfasComponent', () => {
  let component: MyIfasComponent;
  let fixture: ComponentFixture<MyIfasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyIfasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyIfasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
