import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplantAppTestComponent } from './implant-app-test.component';

describe('ImplantAppTestComponent', () => {
  let component: ImplantAppTestComponent;
  let fixture: ComponentFixture<ImplantAppTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImplantAppTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplantAppTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
