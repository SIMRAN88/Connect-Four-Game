import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './pages/game/game.component';
import { HomeComponent } from './pages/home/home.component';
import { TwoPlayerGameComponent } from './pages/two-player-game/two-player-game.component';


const routes: Routes = [{ path: "", redirectTo: "/home", pathMatch: "full" },
{ path: "home", component: HomeComponent },
{path:"game", component:GameComponent},
{path:"two-player-game", component: TwoPlayerGameComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
