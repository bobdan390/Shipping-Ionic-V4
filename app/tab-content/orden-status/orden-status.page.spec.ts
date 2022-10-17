import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdenStatusPage } from './orden-status.page';

describe('OrdenStatusPage', () => {
  let component: OrdenStatusPage;
  let fixture: ComponentFixture<OrdenStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenStatusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdenStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
