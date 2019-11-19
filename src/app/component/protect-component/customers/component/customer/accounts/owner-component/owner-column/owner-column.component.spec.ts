import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerColumnComponent } from './owner-column.component';

describe('OwnerColumnComponent', () => {
  let component: OwnerColumnComponent;
  let fixture: ComponentFixture<OwnerColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
