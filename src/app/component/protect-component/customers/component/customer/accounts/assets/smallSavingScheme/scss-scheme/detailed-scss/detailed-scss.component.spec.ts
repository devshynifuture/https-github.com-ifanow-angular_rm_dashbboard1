import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedScssComponent } from './detailed-scss.component';

describe('DetailedScssComponent', () => {
  let component: DetailedScssComponent;
  let fixture: ComponentFixture<DetailedScssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedScssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedScssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
