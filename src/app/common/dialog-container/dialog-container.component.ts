import {Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {EventService} from '../../Data-service/event.service';
import {SubscriptionInject} from '../../component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {DynamicComponentService} from '../../services/dynamic-component.service';
import {dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation} from '../../animation/animation';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dialog-container',
  templateUrl: './dialog-container.component.html',
  styleUrls: ['./dialog-container.component.scss'],
  animations: [
    dialogContainerOpacity,
    rightSliderAnimation,
    // getRightSliderAnimation(40),
    upperSliderAnimation
  ]
})
//
export class DialogContainerComponent implements OnInit, OnDestroy {

  @ViewChild('dynamic', {
    read: ViewContainerRef,
    static: true
  }) viewContainerRef: ViewContainerRef;

  @ViewChild('dynamicUpper', {
    read: ViewContainerRef,
    static: true
  }) viewContainerRefUpper: ViewContainerRef;

  @Input() parentComponentName;
  invoiceHisData: any;
  inputData;
  fragmentData;
  selectedSubscriptionTab: any;

  isOverlayVisible = true;
  currentState;
  subscriptionTab;
  dialogState;
  componentName;
  upperSliderData;
  headerData = 'EMAIL QUOTATION';
  headerDataDocuments = 'EMAIL DOCS WITH E-SIGN REQUEST';
  upperSliderDataObsSubscription: Subscription;
  newRightSliderDataObsSubscription: Subscription;

  constructor(
    protected eventService: EventService,
    protected subinject: SubscriptionInject,
    protected dynamicComponentService: DynamicComponentService
  ) {
    this.upperSliderDataObsSubscription = this.eventService.upperSliderDataObs.subscribe(
      data => {
        const tempData: any = data;
        if (tempData.state == 'close') {
          this.closeUpperDynamicElement();
        } else if (tempData.componentName) {
          this.openDynamicComponent(data);
        } else {
          this.closeUpperDynamicElement();
        }

        this.upperSliderData = data;
      }
    );
    this.newRightSliderDataObsSubscription = this.subinject.newRightSliderDataObs.subscribe((data) => {
      const tempData: any = data;
      if (tempData.componentName) {
        this.openDynamicComponent(data);
      }
      this.fragmentData = data;
      this.getFileResponseDataAum(this.fragmentData.flag);
      this.inputData = this.fragmentData.data;
      this.handleChangeOfState(this.fragmentData.state);
    });
  }


  ngOnInit() {
  }

  getInvoiceHistoryData(data) {
    this.invoiceHisData = data;
  }

  getRightSliderData(value) {
    this.currentState = value;
  }

  getFileResponseDataAum(data) {
    this.subscriptionTab = data;
  }

  getSubscriptionTabChangeData(data) {
    this.selectedSubscriptionTab = data;
  }

  openDynamicComponent(inputData) {

    switch (inputData.direction) {
      case 'top':
        this.addUpperDynamicComponentService(this.viewContainerRefUpper, inputData);
        break;
      default: //right
        this.addDynamicComponentService(this.viewContainerRef, inputData);
        break;
    }
  }

  closeUpperDynamicElement() {
    if (this.viewContainerRefUpper) {
      this.viewContainerRefUpper.clear();
    }
  }

  addDynamicComponentService(viewContainerRef, inputData) {
    if (viewContainerRef) {
      this.dynamicComponentService.addDynamicComponent(viewContainerRef, inputData.componentName, inputData.data, inputData.popupHeaderText);
    }
  }

  addUpperDynamicComponentService(viewContainerRef, inputData) {
    if (viewContainerRef) {
      this.dynamicComponentService.addDynamicComponent(viewContainerRef, inputData.componentName, inputData.data);
    }
  }

  handleChangeOfState(value) {
    if (value === 'close') {
      this.currentState = value;
      setTimeout(() => {
        this.dialogState = value;
        this.isOverlayVisible = false;
        if (this.viewContainerRef) {
          this.viewContainerRef.clear();
        }
      }, 300);
    } else {
      this.currentState = value;
      setTimeout(() => {
        this.dialogState = 'open';
        this.isOverlayVisible = (this.fragmentData.isOverlayVisible == undefined ? true : this.fragmentData.isOverlayVisible);
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.upperSliderDataObsSubscription.unsubscribe();
    this.newRightSliderDataObsSubscription.unsubscribe();
  }

  close() {
    this.subinject.closeNewRightSlider({state: 'close'});
  }
}
