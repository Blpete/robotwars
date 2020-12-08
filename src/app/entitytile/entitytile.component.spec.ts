import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitytileComponent } from './entitytile.component';

describe('EntitytileComponent', () => {
  let component: EntitytileComponent;
  let fixture: ComponentFixture<EntitytileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntitytileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitytileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
