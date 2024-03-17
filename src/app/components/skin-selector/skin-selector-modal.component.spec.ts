import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkinSelectorModalComponent } from './skin-selector-modal.component';

describe('SkinSelectorComponent', () => {
  let component: SkinSelectorModalComponent;
  let fixture: ComponentFixture<SkinSelectorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkinSelectorModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkinSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
