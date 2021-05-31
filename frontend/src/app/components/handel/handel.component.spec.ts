import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HandelComponent } from './handel.component';

describe('HandelComponent', () => {
  let component: HandelComponent;
  let fixture: ComponentFixture<HandelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandelComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HandelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
