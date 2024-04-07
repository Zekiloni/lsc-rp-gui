import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaMapComponent } from './sa-map.component';

describe('SaMapComponent', () => {
  let component: SaMapComponent;
  let fixture: ComponentFixture<SaMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
