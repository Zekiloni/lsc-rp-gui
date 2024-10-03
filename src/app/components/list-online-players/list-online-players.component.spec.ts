import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOnlinePlayersComponent } from './list-online-players.component';

describe('ListOnlinePlayersComponent', () => {
  let component: ListOnlinePlayersComponent;
  let fixture: ComponentFixture<ListOnlinePlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOnlinePlayersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOnlinePlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
