import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnsTableComponent } from './warns-table.component';

describe('WarnsTableComponent', () => {
  let component: WarnsTableComponent;
  let fixture: ComponentFixture<WarnsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarnsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarnsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
