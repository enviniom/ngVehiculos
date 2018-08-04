import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehAddComponent } from './veh-add.component';

describe('VehAddComponent', () => {
  let component: VehAddComponent;
  let fixture: ComponentFixture<VehAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
