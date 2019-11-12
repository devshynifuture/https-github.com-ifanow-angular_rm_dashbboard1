import {Component, Input, OnInit} from '@angular/core';
import {dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation} from '../../animation/animation';

@Component({
  selector: 'app-custom-dialog-container',
  templateUrl: './custom-dialog-container.component.html',
  styleUrls: ['./custom-dialog-container.component.scss'],
  animations: [
    dialogContainerOpacity,
    rightSliderAnimation,
    // getRightSliderAnimation(40),
    upperSliderAnimation
  ]
})
export class CustomDialogContainerComponent implements OnInit {

  isOverlayVisible;
  dialogState;

  constructor() {
  }

  _currentState;

  // percentageClose = '40%';

  @Input()
  set currentState(currentState: string) {
    this.handleChangeOfState(currentState);
  }

  ngOnInit() {
  }

  handleChangeOfState(value) {
    console.log('CustomDialogContainerComponent handleChangeOfState: ', value);
    if (value === 'close') {
      this._currentState = value;
      setTimeout(() => {
        this.dialogState = value;
        this.isOverlayVisible = false;
      }, 300);
      // this.eventService.changeOverlayVisible(false);
    }  else {
      this._currentState = value;
      setTimeout(() => {
        this.dialogState = 'open';
        this.isOverlayVisible = true;
      }, 100);
    }

  }

}
