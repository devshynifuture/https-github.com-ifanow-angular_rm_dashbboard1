import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFolioMapComponent } from './select-folio-map.component';

describe('SelectFolioMapComponent', () => {
  let component: SelectFolioMapComponent;
  let fixture: ComponentFixture<SelectFolioMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectFolioMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFolioMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
