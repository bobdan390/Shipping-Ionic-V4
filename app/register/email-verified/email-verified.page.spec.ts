import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailVerifiedPage } from './email-verified.page';

describe('EmailVerifiedPage', () => {
  let component: EmailVerifiedPage;
  let fixture: ComponentFixture<EmailVerifiedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVerifiedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerifiedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
