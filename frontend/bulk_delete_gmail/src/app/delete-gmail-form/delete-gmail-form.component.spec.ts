import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGmailFormComponent } from './delete-gmail-form.component';

describe('DeleteGmailFormComponent', () => {
  let component: DeleteGmailFormComponent;
  let fixture: ComponentFixture<DeleteGmailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteGmailFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteGmailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
