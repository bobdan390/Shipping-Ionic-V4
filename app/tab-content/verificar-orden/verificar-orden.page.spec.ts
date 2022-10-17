import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerificarOrdenPage } from './verificar-orden.page';

describe('VerificarOrdenPage', () => {
  let component: VerificarOrdenPage;
  let fixture: ComponentFixture<VerificarOrdenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificarOrdenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerificarOrdenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
