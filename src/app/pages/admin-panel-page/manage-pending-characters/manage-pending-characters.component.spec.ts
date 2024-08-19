import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePendingCharactersComponent } from './manage-pending-characters.component';

describe('ManagePendingCharactersComponent', () => {
  let component: ManagePendingCharactersComponent;
  let fixture: ComponentFixture<ManagePendingCharactersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePendingCharactersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagePendingCharactersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
