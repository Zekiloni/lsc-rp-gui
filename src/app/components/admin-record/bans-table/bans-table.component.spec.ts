import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BansTableComponent } from './bans-table.component';

describe('BansTableComponent', () => {
  let component: BansTableComponent;
  let fixture: ComponentFixture<BansTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BansTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BansTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
