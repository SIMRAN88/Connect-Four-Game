import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {
noOfGamesSelected='5 Games';
gamesSelected='5';
turnSelected='Alternative turn';
gameValuesObject = {};
  constructor() { }

  setNumberOfGamesSelected(data){
   this.noOfGamesSelected = data.name;
   this.gamesSelected = data.value
  }
  setTurnsSelected(value){
    this.turnSelected = value;
  }

  setGameValues(data){
   this.gameValuesObject = {
    playerOneName:data.playerOneName,
    playerTwoName:data.playerTwoName,
    gameTurnOption:this.turnSelected,
    ganeNumberOption:this.gamesSelected
   }
  }
}
