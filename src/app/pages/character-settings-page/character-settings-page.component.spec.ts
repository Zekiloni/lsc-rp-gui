import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSettingsPageComponent } from './character-settings-page.component';

describe('CharacterSettingsPageComponent', () => {
  let component: CharacterSettingsPageComponent;
  let fixture: ComponentFixture<CharacterSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterSettingsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CharacterSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
