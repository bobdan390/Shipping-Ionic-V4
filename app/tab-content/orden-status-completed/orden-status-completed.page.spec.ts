import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdenStatusCompletedPage } from './orden-status-completed.page';

describe('OrdenStatusCompletedPage', () => {
  let component: OrdenStatusCompletedPage;
  let fixture: ComponentFixture<OrdenStatusCompletedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenStatusCompletedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdenStatusCompletedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
