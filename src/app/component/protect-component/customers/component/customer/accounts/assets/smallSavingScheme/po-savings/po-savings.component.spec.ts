import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoSavingsComponent } from './po-savings.component';

describe('PoSavingsComponent', () => {
  let component: PoSavingsComponent;
  let fixture: ComponentFixture<PoSavingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoSavingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
