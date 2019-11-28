import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewOthersComponent } from './detailed-view-others.component';

describe('DetailedViewOthersComponent', () => {
  let component: DetailedViewOthersComponent;
  let fixture: ComponentFixture<DetailedViewOthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewOthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
