import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoPlayerGameComponent } from './two-player-game.component';

describe('TwoPlayerGameComponent', () => {
  let component: TwoPlayerGameComponent;
  let fixture: ComponentFixture<TwoPlayerGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoPlayerGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoPlayerGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
