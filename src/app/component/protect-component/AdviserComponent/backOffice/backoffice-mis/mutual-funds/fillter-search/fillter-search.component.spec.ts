import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillterSearchComponent } from './fillter-search.component';

describe('FillterSearchComponent', () => {
  let component: FillterSearchComponent;
  let fixture: ComponentFixture<FillterSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillterSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
