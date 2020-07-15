import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksMobComponent } from './stocks-mob.component';

describe('StocksMobComponent', () => {
  let component: StocksMobComponent;
  let fixture: ComponentFixture<StocksMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
