import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgicalImplantsComponent } from './surgical-implants.component';

describe('SurgicalImplantsComponent', () => {
  let component: SurgicalImplantsComponent;
  let fixture: ComponentFixture<SurgicalImplantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurgicalImplantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurgicalImplantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
