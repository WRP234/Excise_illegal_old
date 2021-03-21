import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOffenseComponent } from './modal-offense.component';

describe('ModalOffenseComponent', () => {
  let component: ModalOffenseComponent;
  let fixture: ComponentFixture<ModalOffenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalOffenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOffenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
