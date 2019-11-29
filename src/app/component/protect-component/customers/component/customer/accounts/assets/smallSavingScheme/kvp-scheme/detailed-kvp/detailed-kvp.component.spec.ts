import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedKvpComponent } from './detailed-kvp.component';

describe('DetailedKvpComponent', () => {
  let component: DetailedKvpComponent;
  let fixture: ComponentFixture<DetailedKvpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedKvpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedKvpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
