import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoSigntureComponent } from './photo-signture.component';

describe('PhotoSigntureComponent', () => {
  let component: PhotoSigntureComponent;
  let fixture: ComponentFixture<PhotoSigntureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoSigntureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoSigntureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
