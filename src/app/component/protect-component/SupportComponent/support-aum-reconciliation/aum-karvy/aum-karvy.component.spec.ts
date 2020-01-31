import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AumKarvyComponent } from './aum-karvy.component';

describe('AumKarvyComponent', () => {
  let component: AumKarvyComponent;
  let fixture: ComponentFixture<AumKarvyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumKarvyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AumKarvyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
