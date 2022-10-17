import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdenStatusValorarPage } from './orden-status-valorar.page';

describe('OrdenStatusValorarPage', () => {
  let component: OrdenStatusValorarPage;
  let fixture: ComponentFixture<OrdenStatusValorarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenStatusValorarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdenStatusValorarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
