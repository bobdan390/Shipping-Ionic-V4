import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MetodoPagoPage } from './metodo-pago.page';

describe('MetodoPagoPage', () => {
  let component: MetodoPagoPage;
  let fixture: ComponentFixture<MetodoPagoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodoPagoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MetodoPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
