import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZadaniComponent } from './zadani.component';

describe('ZadaniComponent', () => {
  let component: ZadaniComponent;
  let fixture: ComponentFixture<ZadaniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZadaniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZadaniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
