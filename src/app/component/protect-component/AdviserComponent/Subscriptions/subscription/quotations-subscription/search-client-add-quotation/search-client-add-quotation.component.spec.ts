import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchClientAddQuotationComponent } from './search-client-add-quotation.component';

describe('SearchClientAddQuotationComponent', () => {
  let component: SearchClientAddQuotationComponent;
  let fixture: ComponentFixture<SearchClientAddQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchClientAddQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchClientAddQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
