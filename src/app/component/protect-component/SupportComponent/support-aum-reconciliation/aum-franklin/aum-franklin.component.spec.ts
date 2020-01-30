import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AumFranklinComponent } from './aum-franklin.component';

describe('AumFranklinComponent', () => {
  let component: AumFranklinComponent;
  let fixture: ComponentFixture<AumFranklinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumFranklinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AumFranklinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
