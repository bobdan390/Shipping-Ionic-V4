import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdenValorarPage } from './orden-valorar.page';

describe('OrdenValorarPage', () => {
  let component: OrdenValorarPage;
  let fixture: ComponentFixture<OrdenValorarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenValorarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdenValorarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
