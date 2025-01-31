import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderProgettiComponent } from './slider-progetti.component';

describe('SliderProgettiComponent', () => {
  let component: SliderProgettiComponent;
  let fixture: ComponentFixture<SliderProgettiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SliderProgettiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderProgettiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
