import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltryComponent } from './filtry.component';

describe('FiltryComponent', () => {
  let component: FiltryComponent;
  let fixture: ComponentFixture<FiltryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
