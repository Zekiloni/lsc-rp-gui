import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicksTableComponent } from './kicks-table.component';

describe('KicksTableComponent', () => {
  let component: KicksTableComponent;
  let fixture: ComponentFixture<KicksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KicksTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KicksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
