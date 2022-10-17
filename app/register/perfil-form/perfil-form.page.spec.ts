import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PerfilFormPage } from './perfil-form.page';

describe('PerfilFormPage', () => {
  let component: PerfilFormPage;
  let fixture: ComponentFixture<PerfilFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
