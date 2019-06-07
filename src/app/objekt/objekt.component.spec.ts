import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjektComponent } from './objekt.component';

describe('ObjektComponent', () => {
  let component: ObjektComponent;
  let fixture: ComponentFixture<ObjektComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjektComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjektComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
