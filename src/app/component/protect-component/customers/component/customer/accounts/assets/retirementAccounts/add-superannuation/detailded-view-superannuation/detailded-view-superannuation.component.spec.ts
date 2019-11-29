import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaildedViewSuperannuationComponent } from './detailded-view-superannuation.component';

describe('DetaildedViewSuperannuationComponent', () => {
  let component: DetaildedViewSuperannuationComponent;
  let fixture: ComponentFixture<DetaildedViewSuperannuationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetaildedViewSuperannuationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaildedViewSuperannuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
