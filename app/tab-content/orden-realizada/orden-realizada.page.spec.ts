import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdenRealizadaPage } from './orden-realizada.page';

describe('OrdenRealizadaPage', () => {
  let component: OrdenRealizadaPage;
  let fixture: ComponentFixture<OrdenRealizadaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenRealizadaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdenRealizadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
