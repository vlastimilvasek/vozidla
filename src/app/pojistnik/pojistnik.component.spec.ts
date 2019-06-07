import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PojistnikComponent } from './adresa.component';

describe('PojistnikComponent', () => {
  let component: PojistnikComponent;
  let fixture: ComponentFixture<PojistnikComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PojistnikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PojistnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
