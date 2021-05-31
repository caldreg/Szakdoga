import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RollbackPage } from './rollback.page';

describe('RollbackPage', () => {
  let component: RollbackPage;
  let fixture: ComponentFixture<RollbackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollbackPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RollbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
