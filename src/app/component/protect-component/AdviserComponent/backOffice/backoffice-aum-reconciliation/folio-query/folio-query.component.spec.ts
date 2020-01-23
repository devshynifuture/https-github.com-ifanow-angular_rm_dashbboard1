import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioQueryComponent } from './folio-query.component';

describe('FolioQueryComponent', () => {
  let component: FolioQueryComponent;
  let fixture: ComponentFixture<FolioQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolioQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolioQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
