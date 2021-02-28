import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ConnectFourService } from 'src/app/services/connect-four/connect-four.service';
import { PlayerColors } from '../../constants/playercolors';

@Component({
    selector: 'app-playground',
    templateUrl: './playground.component.html',
    styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
  isGameWon$;
  isWon=false;
    @Input() id;
    @Input() gridData;
    @Input() psuedoDiscs;
    @Input() chanceColor;
    @Output() onDiscAddition = new EventEmitter();
  
    constructor(private connectFourService:ConnectFourService){}
    ngOnInit(){
      this.isGameWon$ = this.connectFourService.isWonGame$.subscribe(res=>{
        if(res==='Won'){
          this.isWon = true;
        }else{
          this.isWon = false;
        }
      })
      console.log(this.psuedoDiscs);
    }
    getGridDiscClass(colorIdx) {
        return PlayerColors[colorIdx];
    }
   

    handleClick(item, i, j) {
      if(this.isWon === true){
        return false;
      }
        this.onDiscAddition.emit(j);
    }

    handleMouseEnter(item, index) {
        this.psuedoDiscs[index].active = 'active';
    }

    handleMouseLeave(item, index) {
        this.psuedoDiscs[index].active = '';
    }

    handleBlur(item, index) {
        this.psuedoDiscs[index].active = '';
    }
}
