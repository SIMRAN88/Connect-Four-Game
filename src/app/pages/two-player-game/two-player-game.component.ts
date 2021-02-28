import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../components/modal/modal.component';
import { SaveDataService } from '../../services/save-data/save-data.service';

import {LABEL_DATA} from '../../constants/labels';
import {GameTurnOptions} from '../../constants/gameTurnOption';
import {GameNumberOfOptions} from '../../constants/gameNumberOptions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-two-player-game',
  templateUrl: './two-player-game.component.html',
  styleUrls: ['./two-player-game.component.scss']
})
export class TwoPlayerGameComponent implements OnInit {
  labelData = LABEL_DATA;
  gameTurnOptions = GameTurnOptions;
  gameNumberOfOptions = GameNumberOfOptions;
  gamesSelected = "5 Games";
  turnSelected = "Alternative turn";
  playerOneName="David";
  playerTwoName="Maria";
  
  constructor(    private ngbModalService: NgbModal,
    private saveDataService:SaveDataService,
    private router:Router
    ) { }

  ngOnInit(): void {
  }
  playerOneNameChange(event){
    console.log(event);
  }
  playerTwoNameChange(event){
    console.log(event);
  }
  selectNoOfGames(){
    const noOfGames = this.gameNumberOfOptions;
    const data = {
      type: 'gameNumber',
      titleText: 'Number of Game',
      data: noOfGames,
      primaryButtonName: 'OK',
      secondaryButtonName: 'CANCEL',
      callerReference: this,
      cancelAction:null,
      primaryAction:this.getGamesValue

    };
    const modelRef = this.ngbModalService.open(ModalComponent, {
      centered: true
    });
    modelRef.componentInstance.modalConfig = data;   }

    getGamesValue(that){
      that.gamesSelected = that.saveDataService.noOfGamesSelected;
    }

    selectTheTurnOption(){
      const turnOptions = this.gameTurnOptions;
    const data = {
      type: 'turn',
      titleText: 'Who Starts',
      data: turnOptions,
      primaryButtonName: 'OK',
      secondaryButtonName: 'CANCEL',
      callerReference: this,
      cancelAction:null,
      primaryAction:this.getTurnValue

    };
    const modelRef = this.ngbModalService.open(ModalComponent, {
      centered: true
    });
    modelRef.componentInstance.modalConfig = data;   
    }
    getTurnValue(that){
      that.turnSelected = that.saveDataService.turnSelected;

    }
    setFormData(){
      const formData = {
        playerOneName:this.playerOneName,
        playerTwoName:this.playerTwoName,
        gameTurnOption:this.turnSelected,
        ganeNumberOption:this.gamesSelected
      }
      this.saveDataService.setGameValues(formData);
      this.router.navigateByUrl("game");
    }
}
