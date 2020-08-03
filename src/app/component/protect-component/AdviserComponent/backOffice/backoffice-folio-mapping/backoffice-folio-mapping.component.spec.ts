import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeFolioMappingComponent } from './backoffice-folio-mapping.component';

describe('BackofficeFolioMappingComponent', () => {
  let component: BackofficeFolioMappingComponent;
  let fixture: ComponentFixture<BackofficeFolioMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeFolioMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeFolioMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
