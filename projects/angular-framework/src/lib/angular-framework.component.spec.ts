import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularFrameworkComponent } from './angular-framework.component';

describe('AngularFrameworkComponent', () => {
  let component: AngularFrameworkComponent;
  let fixture: ComponentFixture<AngularFrameworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularFrameworkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AngularFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
