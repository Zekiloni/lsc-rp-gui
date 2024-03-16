import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharactersCardsComponent } from './characters-cards.component';

describe('CharactersCardsComponent', () => {
  let component: CharactersCardsComponent;
  let fixture: ComponentFixture<CharactersCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CharactersCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
