import {Component, Input, OnInit, ViewContainerRef, ViewChild} from '@angular/core';
import {dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation} from '../../animation/animation';
import {DynamicComponentService} from "../../services/dynamic-component.service";

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

  constructor(private dynamicComponentService: DynamicComponentService) {
  }

  _currentState;

  // percentageClose = '40%';

  @Input()
  set currentState(currentState: string) {
    this.handleChangeOfState(currentState);
    // this.addDynamicComponentService(this.componentName);

  }

  _componentName;
  @Input()
  set componentName(componentName) {
    this._componentName = componentName;
    this.addDynamicComponentService(componentName);
  }

  get componentName() {
    return this._componentName;
  }

  @ViewChild('dynamic', {
    read: ViewContainerRef,
    static: false
  }) viewContainerRef: ViewContainerRef

  ngOnInit() {
    this.addDynamicComponentService(this.componentName);
  }

  addDynamicComponentService(component) {
    if (this.viewContainerRef) {
      // this.dynamicComponentService.addDynamicComponent(this.viewContainerRef, component);
    }
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
    } else {
      this._currentState = value;
      setTimeout(() => {
        this.dialogState = 'open';
        this.isOverlayVisible = true;
      }, 100);
    }

  }

}
