import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {EventService} from '../../Data-service/event.service';
import {SubscriptionInject} from '../../component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {DynamicComponentService} from '../../services/dynamic-component.service';
import {dialogContainerOpacity, rightSliderAnimation, upperSliderAnimation} from '../../animation/animation';

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
export class DialogContainerComponent implements OnInit {
  @ViewChild('dynamic', {
    read: ViewContainerRef,
    static: false
  }) viewContainerRef: ViewContainerRef;

  @ViewChild('dynamicUpper', {
    read: ViewContainerRef,
    static: false
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

  upperSliderData;
  headerData = 'EMAIL QUOTATION';
  headerDataDocuments = 'EMAIL DOCS WITH E-SIGN REQUEST';

  constructor(protected eventService: EventService, protected subinject: SubscriptionInject,
              protected dynamicComponentService: DynamicComponentService) {
    this.eventService.overlayVisibleData.subscribe(
      data => {
        this.isOverlayVisible = data;
      }
    );
    this.subinject.rightSideBarData.subscribe(
      data => this.getRightSliderData(data)
    );
    this.eventService.sidebarSubscribeData.subscribe(
      data => this.getFileResponseDataAum(data)
    );

    this.eventService.tabChangeData.subscribe(
      data => this.getSubscriptionTabChangeData(data)
    );
    this.eventService.upperSliderDataObs.subscribe(
      data => {
        const tempData: any = data;
        if (tempData.componentName) {
          this.openDynamicComponent(data);
        }
        this.upperSliderData = data;
        // this.fragmentData = data;
      }
    );
    this.subinject.newRightSliderDataObs.subscribe((data) => {
      const tempData: any = data;
      if (tempData.componentName) {
        this.openDynamicComponent(data);
      }
      this.fragmentData = data;
      console.log('fragmentData dialog container: ', this.fragmentData);
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
    console.log('dialog container inputData : ', inputData);

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


  addDynamicComponentService(viewContainerRef, inputData) {
    console.log('dialog container addDynamicComponentService viewContainerRef : ', viewContainerRef);

    if (viewContainerRef) {
      console.log('dialog container addDynamicComponentService inputData : ', inputData);

      this.dynamicComponentService.addDynamicComponent(viewContainerRef, inputData.componentName, inputData.data);
      // this.handleChangeOfState(this.tempState);
    }
  }

  addUpperDynamicComponentService(viewContainerRef, inputData) {
    console.log('dialog container addUpperDynamicComponentService viewContainerRef : ', viewContainerRef);

    if (viewContainerRef) {
      console.log('dialog container addUpperDynamicComponentService inputData : ', inputData);

      this.dynamicComponentService.addDynamicComponent(viewContainerRef, inputData.componentName, inputData.data);
      // this._upperSliderCase = this.tempState;
    }
  }

  handleChangeOfState(value) {
    console.log('DynamicComponentComponent handleChangeOfState: ', value);
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
}
