import { Component, Input, OnInit, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { EventService } from '../../Data-service/event.service';
import { SubscriptionInject } from '../../component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation } from '../../animation/animation';
import { Subscription } from 'rxjs';

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

  isOverlayVisible;
  currentState;
  subscriptionTab;
  dialogState;
  componentName;
  upperSliderData;
  headerData = 'EMAIL QUOTATION';
  headerDataDocuments = 'EMAIL DOCS WITH E-SIGN REQUEST';
  upperSliderDataObsSubscription: Subscription;
  newRightSliderDataObsSubscription: Subscription;
  constructor(protected eventService: EventService, protected subinject: SubscriptionInject,
    protected dynamicComponentService: DynamicComponentService) {
    // this.eventService.overlayVisibleData.subscribe(
    //   data => {
    //     this.isOverlayVisible = data;
    //   }
    // );
    // this.subinject.rightSideBarData.subscribe(
    //   data => {
    //     this.getRightSliderData(data);
    //   }
    // );
    // this.eventService.sidebarSubscribeData.subscribe(
    //   data => this.getFileResponseDataAum(data)
    // );

    // this.eventService.tabChangeData.subscribe(
    //   data => this.getSubscriptionTabChangeData(data)
    // );
    this.upperSliderDataObsSubscription = this.eventService.upperSliderDataObs.subscribe(
      data => {
        console.log(this.componentName + ' DialogContainerComponent upper slider Subscription data', data);

        const tempData: any = data;
        if (tempData.componentName) {
          this.openDynamicComponent(data);
        } else {
          this.closeUpperDynamicElement();
        }

        this.upperSliderData = data;
        // this.fragmentData = data;
      }
    );
    this.newRightSliderDataObsSubscription = this.subinject.newRightSliderDataObs.subscribe((data) => {
      const tempData: any = data;
      if (tempData.componentName) {
        this.openDynamicComponent(data);
      }
      this.fragmentData = data;
      console.log(this.componentName + 'fragmentData dialog container: ', this.fragmentData);
      this.getFileResponseDataAum(this.fragmentData.flag);
      this.inputData = this.fragmentData.data;
      this.handleChangeOfState(this.fragmentData.state);
      // this.getRightSliderData(this.fragmentData.state);
    });
    // this.subinject.singleProfileData.subscribe(
    //   data =>this.getInvoiceHistoryData(data)
    // );
    // this.eventService.changeUpperSliderState()
  }


  ngOnInit() {
  }

  getInvoiceHistoryData(data) {
    this.invoiceHisData = data;
  }

  getRightSliderData(value) {
    console.log(this.componentName + 'getRightSliderData dialog container comp currentState', value);
    this.currentState = value;
  }

  getFileResponseDataAum(data) {
    this.subscriptionTab = data;
    // this.subscriptionTab = CreateSubscriptionComponent;
  }

  getSubscriptionTabChangeData(data) {
    this.selectedSubscriptionTab = data;
  }

  openDynamicComponent(inputData) {
    console.log(this.componentName + 'dialog container inputData : ', inputData);

    if (inputData.direction) {
      if (inputData.direction == 'top') {
        this.addUpperDynamicComponentService(this.viewContainerRefUpper, inputData);
      } else if (inputData.direction == 'right') {
        this.addDynamicComponentService(this.viewContainerRef, inputData);
      }
    } else {
      this.addDynamicComponentService(this.viewContainerRef, inputData);
    }
  }

  closeUpperDynamicElement() {
    if (this.viewContainerRefUpper) {
      this.viewContainerRefUpper.clear();
    }
  }

  addDynamicComponentService(viewContainerRef, inputData) {
    console.log(this.componentName + 'dialog container addDynamicComponentService viewContainerRef : ', viewContainerRef);

    if (viewContainerRef) {
      console.log(this.componentName + 'dialog container addDynamicComponentService inputData : ', inputData);

      this.dynamicComponentService.addDynamicComponent(viewContainerRef, inputData.componentName, inputData.data);
      // this.handleChangeOfState(this.tempState);
    }
  }

  addUpperDynamicComponentService(viewContainerRef, inputData) {
    console.log(this.componentName + 'dialog container addUpperDynamicComponentService viewContainerRef : ', viewContainerRef);

    if (viewContainerRef) {
      console.log(this.componentName + 'dialog container addUpperDynamicComponentService inputData : ', inputData);

      this.dynamicComponentService.addDynamicComponent(viewContainerRef, inputData.componentName, inputData.data);
      // this._upperSliderCase = this.tempState;
    }
  }

  handleChangeOfState(value) {
    console.log(this.componentName + 'DynamicComponentComponent handleChangeOfState: ', value);
    if (value === 'close') {
      this.currentState = value;
      setTimeout(() => {
        this.dialogState = value;
        this.isOverlayVisible = false;
      }, 300);
      // this.eventService.changeOverlayVisible(false);
    } else {
      this.currentState = value;
      setTimeout(() => {
        this.dialogState = 'open';
        this.isOverlayVisible = true;
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.upperSliderDataObsSubscription.unsubscribe();

    this.newRightSliderDataObsSubscription.unsubscribe();
    // throw new Error("Method not implemented.");
  }
}
