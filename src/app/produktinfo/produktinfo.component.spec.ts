import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduktinfoComponent } from './produktinfo.component';

describe('ProduktinfoComponent', () => {
  let component: ProduktinfoComponent;
  let fixture: ComponentFixture<ProduktinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProduktinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduktinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
