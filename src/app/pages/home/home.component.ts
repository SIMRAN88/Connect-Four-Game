import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/components/modal/modal.component';

import {LABEL_DATA} from '../../constants/labels';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
labelData = LABEL_DATA;
  constructor(private router:Router, private ngbModalService:NgbModal) { }

  ngOnInit(): void {
  }
  launchTwoPlayersGame(){
    this.router.navigateByUrl('two-player-game')
  }
  comingSoon(){
    const data = {
      type: 'normal',
      titleText: 'Coming Soon',
      primaryButtonName: 'OK',
      secondaryButtonName: 'CANCEL',
      callerReference: this,
      cancelAction:null,
    };
    const modelRef = this.ngbModalService.open(ModalComponent, {
      centered: true
    });
    modelRef.componentInstance.modalConfig = data;   }
  }

