import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehViewComponent } from './veh-view.component';

describe('VehViewComponent', () => {
  let component: VehViewComponent;
  let fixture: ComponentFixture<VehViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
