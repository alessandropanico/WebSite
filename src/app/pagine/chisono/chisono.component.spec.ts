import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChisonoComponent } from './chisono.component';

describe('ChisonoComponent', () => {
  let component: ChisonoComponent;
  let fixture: ComponentFixture<ChisonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChisonoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChisonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
