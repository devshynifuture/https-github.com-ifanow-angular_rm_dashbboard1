import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeMappingComponent } from './scheme-mapping.component';

describe('SchemeMappingComponent', () => {
  let component: SchemeMappingComponent;
  let fixture: ComponentFixture<SchemeMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
