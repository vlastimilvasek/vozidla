import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PojistenyComponent } from './pojisteny.component';

describe('PojistenyComponent', () => {
  let component: PojistenyComponent;
  let fixture: ComponentFixture<PojistenyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PojistenyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PojistenyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
