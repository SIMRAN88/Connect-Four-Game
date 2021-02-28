import { BrowserModule } from '@angular/platform-browser';
import { NgModule  } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './pages/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { TwoPlayerGameComponent } from './pages/two-player-game/two-player-game.component';
import { GameComponent } from './pages/game/game.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { DiscService } from './services/disc/disc.service';
import { MinmaxService } from './services/min-max/min-max.service';
import { ConnectFourService } from './services/connect-four/connect-four.service';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalComponent,
    TwoPlayerGameComponent,
    GameComponent,
    PlaygroundComponent,
    LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [NgbActiveModal,DiscService, MinmaxService, ConnectFourService],
  bootstrap: [AppComponent]
})
export class AppModule { }
