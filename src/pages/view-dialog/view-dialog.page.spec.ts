import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewDialogPage } from './view-dialog.page';

describe('ViewDialogPage', () => {
  let component: ViewDialogPage;
  let fixture: ComponentFixture<ViewDialogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDialogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDialogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
