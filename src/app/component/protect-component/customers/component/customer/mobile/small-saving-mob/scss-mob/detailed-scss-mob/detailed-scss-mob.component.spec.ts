import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedScssMobComponent } from './detailed-scss-mob.component';

describe('DetailedScssMobComponent', () => {
  let component: DetailedScssMobComponent;
  let fixture: ComponentFixture<DetailedScssMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedScssMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedScssMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
