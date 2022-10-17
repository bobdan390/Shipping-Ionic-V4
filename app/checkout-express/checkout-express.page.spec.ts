import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheckoutExpressPage } from './checkout-express.page';

describe('CheckoutExpressPage', () => {
  let component: CheckoutExpressPage;
  let fixture: ComponentFixture<CheckoutExpressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutExpressPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutExpressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
