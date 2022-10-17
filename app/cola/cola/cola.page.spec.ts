import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColaPage } from './cola.page';

describe('ColaPage', () => {
  let component: ColaPage;
  let fixture: ComponentFixture<ColaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
