import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeployPage } from './deploy.page';

describe('DeployPage', () => {
  let component: DeployPage;
  let fixture: ComponentFixture<DeployPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeployPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeployPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
