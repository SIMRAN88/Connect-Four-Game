import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewEncapsulation,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SaveDataService } from "src/app/services/save-data/save-data.service";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit {
  @Input() modalConfig;
  radioSelected = "5 games";
  modalType='';
  constructor(
    private el: ElementRef,
    public activeModal: NgbActiveModal,
    private saveDataService: SaveDataService
  ) {}
  ngOnInit() {
    setTimeout(() => this.firstFocusEl(), 100);
    if (this.modalConfig.type === "turn") {
      this.radioSelected = "Alternative turn";
      this.modalType = 'radioModal';
    } else if (this.modalConfig.type === "gameNumber"){
      this.radioSelected = "5 Games";
      this.modalType = 'radioModal';
    }else{
      this.modalType = 'normal';
    }
    
  }
  onItemChange(item) {
    if (this.modalConfig.type === "turn") {
      this.saveDataService.setTurnsSelected(item.value);
    } else if (this.modalConfig.type === "gameNumber")
      this.saveDataService.setNumberOfGamesSelected(item);
  }

  primaryBtnAction() {
    if (this.modalConfig.primaryAction) {
      this.modalConfig.primaryAction(this.modalConfig.callerReference);
    }
  }

  secondaryBtnAction() {
    if (this.modalConfig.secondaryAction) {
      this.modalConfig.secondaryAction(this.modalConfig.callerReference);
    }
  }

  tertiaryBtnAction() {
    if (this.modalConfig.tertiaryAction) {
      this.modalConfig.tertiaryAction(this.modalConfig.callerReference);
    }
  }

  onClickCross() {
    // Checking if the modal type is the Launch Error one then Wrap-up the tool flow on launch
    // if (this.modalConfig.headerDescription === this.messages.launch.inValidLaunchError) {
    //   this.primaryBtnAction();
    // }
  }

  tabCycle(event) {
    const focusEls = this.el.nativeElement.querySelectorAll(
      'input:not([disabled]),button:not([disabled]), [tabindex="0"]'
    );
    const firstFocusEl = focusEls[0];
    const lastFocusEl = focusEls[focusEls.length - 1];
    if (event.keyCode === 9) {
      if (!event.shiftKey) {
        if (document.activeElement === lastFocusEl) {
          event.preventDefault();
          firstFocusEl.focus();
        }
      } else {
        if (document.activeElement === firstFocusEl) {
          event.preventDefault();
          lastFocusEl.focus();
        }
      }
    }
    if (event.keyCode === 27) {
      this.activeModal.close("ok Click");
    }
  }

  firstFocusEl() {
    const focusEls = this.el.nativeElement.querySelectorAll(
      'input:not([disabled]),button:not([disabled]), [tabindex="0"]'
    );
    const firstFocusEl = focusEls[0];
    if (firstFocusEl) {
      firstFocusEl.focus();
    }
  }
}
