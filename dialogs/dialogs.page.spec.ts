import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialogsPage } from './dialogs.page';

describe('DialogsPage', () => {
  let component: DialogsPage;
  let fixture: ComponentFixture<DialogsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
