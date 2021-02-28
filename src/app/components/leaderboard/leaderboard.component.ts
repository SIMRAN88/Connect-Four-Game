import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, SubscribableOrPromise, Subscription } from "rxjs";
import { ConnectFourService } from "src/app/services/connect-four/connect-four.service";
import { SaveDataService } from "src/app/services/save-data/save-data.service";

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.scss"],
})
export class LeaderboardComponent implements OnInit {
  noOfGames;
  playerOneName;
  playerTwoName;
  isWonGame$: Subscription;
  gamesPlayed = 0;
  isWon = false;
  turnSelected: string;
  currentPlaying = "Player 01";
  playingNext: string;
  playerWon: string;
  playerWonName:string;
  playerOneScore = 0;
  playerTwoScore = 0;
  declaredWon='';
  constructor(
    private saveDataService: SaveDataService,
    private connectFourService: ConnectFourService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getConfigs();
    this.getIsWon();
    this.getDiscAdded();
  }

  getConfigs() {
    this.noOfGames = Number(this.saveDataService.gamesSelected);
    this.playerOneName = this.saveDataService.gameValuesObject["playerOneName"];
    this.playerTwoName = this.saveDataService.gameValuesObject["playerTwoName"];
    this.turnSelected = this.saveDataService.turnSelected;
  }
  getIsWon() {
    this.isWonGame$ = this.connectFourService.isWonGame$.subscribe((res) => {
      if (res === "Won") {
        this.isWon = true;
        this.gamesPlayed = this.gamesPlayed + 1;
        const playerWonIndex = this.connectFourService.playerWonIndex;
        if (playerWonIndex === 0) {
          this.playerWon = "Player 01";
          this.playerWonName = this.playerOneName;
          this.playerOneScore++;
        } else {
          this.playerWon = "Player 02";
          this.playerWonName = this.playerTwoName;
          this.playerTwoScore++;
        }
        this.getNextInitGamesConfigs();
        this.checkWinner();
      } else {
        this.isWon = false;
      }
    });
  }
  checkWinner() {
    const wonCount = Math.floor(this.noOfGames / 2);
    if (this.playerOneScore >= wonCount + 1) {
      this.declaredWon = "Player 01";
    } else if (this.playerTwoScore >= wonCount + 1) {
      this.declaredWon === "Player 02";
    } else{
      this.declaredWon = '';
    }
  }
  getDiscAdded() {
    this.connectFourService.discAdded$.subscribe((res) => {
      if(res!=='no'){
        if (this.currentPlaying === "Player 01") {
          this.currentPlaying = "Player 02";
        } else {
          this.currentPlaying = "Player 01";
        }
      }    
    });
  }
  getNextInitGamesConfigs() {
    if (this.turnSelected === "Always player 01") {
      this.connectFourService.playerStarting = "Player 01";
    } else if (this.turnSelected === "Always player 02") {
      this.connectFourService.playerStarting = "Player 02";
    } else if (this.turnSelected === "Alternative turn") {
      if (this.connectFourService.playerStarting === "Player 01") {
        this.connectFourService.playerStarting = "Player 02";
      } else {
        this.connectFourService.playerStarting = "Player 01";
      }
    } else if (this.turnSelected === "Loser first") {
      if (this.playerWon === "Player 01") {
        this.connectFourService.playerStarting = "Player 02";
      } else {
        this.connectFourService.playerStarting = "Player 01";
      }
    } else if (this.turnSelected === "Winner first") {
      if (this.playerWon === "Player 01") {
        this.connectFourService.playerStarting = "Player 01";
      } else {
        this.connectFourService.playerStarting = "Player 02";
      }
    }
    this.currentPlaying = this.connectFourService.playerStarting;
  }
  disableNextGameButton(){
    if(!this.isWon){
      return true;
    }else if(this.declaredWon !==''){
      return true;
    }
  }
  startNextGame() {
    this.connectFourService.restartGame.next(true);
  }
  endTournament() {
    this.router.navigateByUrl("home");
  }
}
