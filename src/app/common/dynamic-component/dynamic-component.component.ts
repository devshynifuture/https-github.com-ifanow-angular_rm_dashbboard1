import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation} from '../../animation/animation';
import {DynamicComponentService} from '../../services/dynamic-component.service';
import {DataComponent} from '../../interfaces/data.component';

@Component({
  selector: 'app-dynamic-component',
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss'],
  animations: [
    dialogContainerOpacity,
    rightSliderAnimation,
    // getRightSliderAnimation(40),
    upperSliderAnimation
  ]
})
export class DynamicComponentComponent implements OnInit, DataComponent {
  _data: any;
  isOverlayVisible;
  dialogState;

  _currentState;
  _componentName;
  _upperSliderCase;

  constructor(private dynamicComponentService: DynamicComponentService) {
  }

  @Input()
  set upperSliderState(upperSliderState) {
    this.tempState = upperSliderState;
    if (this.viewContainerRef) {
      this._upperSliderCase = upperSliderState;
      // this.handleChangeOfState();
    }
    // this._upperSliderCase = upperSliderState;
  }

  get upperSliderState() {
    return this._upperSliderCase;
  }

  // percentageClose = '40%';
  tempState;

  @Input()
  set currentState(currentState: string) {
    this.tempState = currentState;
    // this.addDynamicComponentService(this.componentName);
    if (this.viewContainerRef) {
      this.handleChangeOfState(currentState);
    }
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    if (inputData.componentName) {
      this._componentName = inputData.componentName;
      console.log('DynamicComponentComponent INPUT: data ', inputData);
      if (inputData.direction) {
        if (inputData.direction == 'top') {
          this.addDynamicComponentService(this.viewContainerRefUpper, inputData.componentName);
        } else if (inputData.direction == 'right') {
          this.addDynamicComponentService(this.viewContainerRef, inputData.componentName);
        }
      } else {
        this.addDynamicComponentService(this.viewContainerRef, inputData.componentName);
      }

    }
  }

  get data() {
    return this._data;
  }

  @Input()
  set componentName(componentName) {
    this._componentName = componentName;
    // this.addDynamicComponentService(componentName);
  }

  get componentName() {
    return this._componentName;
  }

  @ViewChild('dynamic', {
    read: ViewContainerRef,
    static: true
  }) viewContainerRef: ViewContainerRef;

  @ViewChild('dynamicUpper', {
    read: ViewContainerRef,
    static: true
  }) viewContainerRefUpper: ViewContainerRef;

  ngOnInit() {
    console.log('DynamicComponentComponent: ngOnInit data ', this.data);
    console.log('DynamicComponentComponent: ngOnInit this.viewContainerRef ', this.viewContainerRef);
    if (this.componentName) {
      this.addDynamicComponentService(this.viewContainerRef, this.componentName);
    }
  }


  addDynamicComponentService(viewContainerRef, component) {
    if (viewContainerRef) {
      this.dynamicComponentService.addDynamicComponent(viewContainerRef, component, this.data.data);
      this.handleChangeOfState(this.tempState);
    }
  }

  addUpperDynamicComponentService(viewContainerRef, component) {
    if (viewContainerRef) {
      this.dynamicComponentService.addDynamicComponent(viewContainerRef, component, this.data.data);
      // this.handleChangeOfState(this.tempState);
    }
  }

  handleChangeOfState(value) {
    console.log('DynamicComponentComponent handleChangeOfState: ', value);
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

  /*handleChangeOfUpperSliderState(value) {
    console.log('DynamicComponentComponent handleChangeOfState: ', value);
    if (value === 'close') {
      this._upperSliderCase = value;
      setTimeout(() => {
        this.dialogState = value;
        this.isOverlayVisible = false;
      }, 300);
      // this.eventService.changeOverlayVisible(false);
    } else {
      this._upperSliderCase = value;
      setTimeout(() => {
        this.dialogState = 'open';
        this.isOverlayVisible = true;
      }, 100);
    }
  }*/
}
