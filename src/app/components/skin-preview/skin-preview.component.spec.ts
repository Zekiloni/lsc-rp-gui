import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkinPreviewComponent } from './skin-preview.component';

describe('SkinPreviewComponent', () => {
  let component: SkinPreviewComponent;
  let fixture: ComponentFixture<SkinPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkinPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkinPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
