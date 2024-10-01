import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumPanelPageComponent } from './premium-panel-page.component';

describe('PremiumPanelPageComponent', () => {
  let component: PremiumPanelPageComponent;
  let fixture: ComponentFixture<PremiumPanelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumPanelPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PremiumPanelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
