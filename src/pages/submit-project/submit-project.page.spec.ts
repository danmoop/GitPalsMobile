import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubmitProjectPage } from './submit-project.page';

describe('SubmitProjectPage', () => {
  let component: SubmitProjectPage;
  let fixture: ComponentFixture<SubmitProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitProjectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
