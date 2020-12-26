import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PublishForumPostPage } from './publish-forum-post.page';

describe('PublishForumPostPage', () => {
  let component: PublishForumPostPage;
  let fixture: ComponentFixture<PublishForumPostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishForumPostPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PublishForumPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
