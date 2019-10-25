import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-custom-dialog-container',
  templateUrl: './custom-dialog-container.component.html',
  styleUrls: ['./custom-dialog-container.component.scss'],
  animations: [trigger('dialogContainer', [
    state('open', style({
      opacity: 0.25
    })),
    state('openHelp', style({
      opacity: 0.25
// width: '35%'
    })),
    state('close', style({
      opacity: 0

    })),
    transition('close => open', [style({opacity: 0}),
      animate(300, style({opacity: 0.25}))]),
  ]), trigger('openClose', [
    state('open', style({
      left: '40%'
    })),
    state('openHelp', style({
      left: '65%'
    })),
    state('close', style({
      left: '100%'
    })),

    transition('close => open', [animate('0.3s')]),
    transition('open => close', [animate('0.1s')])
  ]),
    trigger('upperSliderOpenClose', [
      state('open', style({
        top: '0%'
      })),
      state('close', style({
        // width:'0%'
        top: '-100%'
      })),

      transition('close => open', [animate('0.3s')]),
      transition('open => close', [animate('0.1s')]),
      transition('close => openHelp', [animate('0.3s')]),
      transition('openHelp => close', [animate('0.1s')])
    ])
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
    } else if (value === 'open') {

      this._currentState = value;
      // this.percentageClose = '40%';
      setTimeout(() => {
        this.dialogState = value;
        this.isOverlayVisible = true;
      }, 100);
    } else if (value === 'openHelp') {
      // this.percentageClose = '65%';

      this._currentState = value;

      setTimeout(() => {
        this.dialogState = value;
        this.isOverlayVisible = true;
      }, 100);
    } else {
      // this.eventService.changeOverlayVisible(true);
    }

  }

}
