import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreditCardFormPage } from './credit-card-form.page';

describe('CreditCardFormPage', () => {
  let component: CreditCardFormPage;
  let fixture: ComponentFixture<CreditCardFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditCardFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreditCardFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
