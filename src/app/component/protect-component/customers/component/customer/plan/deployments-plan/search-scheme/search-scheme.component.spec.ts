import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSchemeComponent } from './search-scheme.component';

describe('SearchSchemeComponent', () => {
  let component: SearchSchemeComponent;
  let fixture: ComponentFixture<SearchSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
