import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdresaComponent } from './adresa.component';

describe('AdresaComponent', () => {
  let component: AdresaComponent;
  let fixture: ComponentFixture<AdresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
