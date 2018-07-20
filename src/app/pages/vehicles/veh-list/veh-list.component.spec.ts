import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehListComponent } from './veh-list.component';

describe('VehListComponent', () => {
  let component: VehListComponent;
  let fixture: ComponentFixture<VehListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
