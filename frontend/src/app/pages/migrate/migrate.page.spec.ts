import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MigratePage } from './migrate.page';

describe('MigratePage', () => {
  let component: MigratePage;
  let fixture: ComponentFixture<MigratePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MigratePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MigratePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
