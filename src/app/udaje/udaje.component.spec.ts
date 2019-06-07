import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdajeComponent } from './udaje.component';

describe('UdajeComponent', () => {
  let component: UdajeComponent;
  let fixture: ComponentFixture<UdajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
