import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IocoFrameworkComponent } from './ioco-framework.component';

describe('IocoFrameworkComponent', () => {
  let component: IocoFrameworkComponent;
  let fixture: ComponentFixture<IocoFrameworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IocoFrameworkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IocoFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
