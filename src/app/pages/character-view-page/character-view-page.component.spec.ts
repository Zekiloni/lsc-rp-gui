import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterViewPageComponent } from './character-view-page.component';

describe('CharacterViewPageComponent', () => {
  let component: CharacterViewPageComponent;
  let fixture: ComponentFixture<CharacterViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterViewPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CharacterViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
