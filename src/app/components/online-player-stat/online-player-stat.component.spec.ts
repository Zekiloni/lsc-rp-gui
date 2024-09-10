import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinePlayerStatComponent } from './online-player-stat.component';

describe('OnlinePlayerStatComponent', () => {
  let component: OnlinePlayerStatComponent;
  let fixture: ComponentFixture<OnlinePlayerStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlinePlayerStatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnlinePlayerStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
