import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Subscription } from "rxjs/internal/Subscription";
import { DiscTypes } from "src/app/constants/disctypes";
import { DiscModel } from "src/app/models/discmodel";
import { DiscService } from "src/app/services/disc/disc.service";
import { PlayerColors } from "../../constants/playercolors";
import { ConnectFourService } from "../../services/connect-four/connect-four.service";

import { LABEL_DATA } from "../../constants/labels";
import { SaveDataService } from "src/app/services/save-data/save-data.service";
@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnDestroy, OnInit {
  playgroundData: DiscModel[][];
  playgroundPsuedoDiscs: DiscModel[];
  chanceColor;
  chanceIdx;
  restartGameSub:Subscription;
  subscription: Subscription;
  labelData = LABEL_DATA;
  turnOption;

  @Input() gameId;
  @Output() gameCompleted = new EventEmitter();

  /**
   * Intialize default values.
   */
  constructor(
    private discService: DiscService,
    private connectFourService: ConnectFourService,
    private saveDataService:SaveDataService
  ) {}

  ngOnInit() {
    this.getConfig();
    this.initGame();

    // Subscribe to events from connectfour service.
    // Dispose on view destruction.
    this.restartGameSub = this.connectFourService.restartGame$.subscribe(res=>{
      if(res===true){
        this.initGame();
      }
    })
    this.subscription = this.connectFourService.discAdded$.subscribe(
      (msg) => {
        if (msg === "Won") {
          this.connectFourService.playerWonIndex = this.chanceIdx;
          setTimeout(() => {
            // alert(`Player ${(this.chanceIdx ^ 1) + 1} wins the game!!!`);
            // this.initGame();
          }, 10); // waiting for completing layout.
        } else if (msg === "Draw") {
          alert("Match Draw");
        } else {
          this.toggleChance();
          console.log("disc added");
        }
      },
      () => {
        console.log("error while adding disc");
      },
      () => {}
    );
  }
  getConfig(){
    this.turnOption = this.saveDataService.turnSelected;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Init Game
   */
  initGame() {
    this.connectFourService.isWonGame.next(false);
    this.connectFourService.discAddedSource.next('no');
    this.initChance();
    this.initplayGroundData();
  }

  /**
   * Selects chance randomly.
   */
  initChance() {
    const player = this.connectFourService.playerStarting;
    if(player === 'Player 01'){
      this.chanceIdx = 0;
    }else{
      this.chanceIdx = 1;
    }
    // select chance on turn option
    this.chanceColor = PlayerColors[this.chanceIdx];
  }



  /**
   * Initialize Connect Four grid values.
   */
  initplayGroundData() {
    this.playgroundData = [];
    for (let i = 0; i < 8; i++) {
      this.playgroundData[i] = [];
      for (let j = 0; j < 8; j++) {
        this.playgroundData[i][j] = this.discService.getDisc(DiscTypes.Blank);
      }
    }

    this.playgroundPsuedoDiscs = [];
    for (let i = 0; i < 8; i++) {
      this.playgroundPsuedoDiscs[i] = this.discService.getDisc(DiscTypes.Blank);
    }
  }

  id() {
    return Math.ceil(Math.random() * 100);
  }

  /**
   * Listens to event from child component for disc addition.
   * @param colIdx Index of column where disc is added
   */
  handleDiscAddition(colIdx) {
    this.connectFourService.addDisc(
      colIdx,
      this.chanceColor,
      this.playgroundData
    );
  }

  /**
   * Toggles chance of players for next move.
   */
  toggleChance() {
    if(this.chanceIdx === 0){
      this.chanceIdx = 1;
    }else{
      this.chanceIdx = 0;
    }
    this.chanceColor = PlayerColors[this.chanceIdx];
  }
}
