import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {EventService} from '../../Data-service/event.service';
import {SubscriptionInject} from '../../component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-dialog-container',
  templateUrl: './dialog-container.component.html',
  styleUrls: ['./dialog-container.component.scss'],
  animations: [trigger('dialogContainer', [
    state('open', style({
      opacity: 0.25
      // 'z-index': 10
    })),
    state('openHelp', style({
      opacity: 0.25
      // left: '0%',
      // 'z-index': 10
// width: '35%'
    })),
    state('close', style({
      opacity: 0
      // width:'0%'
      // left: '100%'
      // 'z-index': -1

    })),
    transition('close => open', [style({opacity: 0}),
      animate(300, style({opacity: 0.25}))]),
    // transition('close => open', [animate('0.3s')]),
    // transition('open => close', [animate('0.1s')]),
    // transition('close => openHelp', [animate('0.3s')]),
    // transition('openHelp => close', [animate('0.1s')])
  ]), trigger('openClose', [
    state('open', style({
      left: '40%'
    })),
    state('openHelp', style({
      left: '65%',
      // width: '35%'
    })),
    state('close', style({
      // width:'0%'
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
//
export class DialogContainerComponent implements OnInit {
  invoiceHisData: any;

  constructor(private eventService: EventService, private subinject: SubscriptionInject) {
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
        console.log('DialogContainerComponent constructor upperSliderDataObs: ', data);
        this.upperSliderData = data;
      }
    );
    // this.subinject.singleProfileData.subscribe(
    //   data =>this.getInvoiceHistoryData(data)
    // );
    // this.eventService.changeUpperSliderState()
  }

  selectedSubscriptionTab: any;

  isOverlayVisible;
  currentState;
  subscriptionTab;
  dialogState;

  upperSliderData;
  headerData = 'EMAIL QUOTATION';
  headerDataDocuments = 'EMAIL DOCS WITH E-SIGN REQUEST';

  ngOnInit() {
  }
  getInvoiceHistoryData(data){
    this.invoiceHisData = data
  }
  getRightSliderData(value) {
    console.log('dialog-container getRightSliderData: ', value);
    if (value === 'close') {
      this.currentState = value;
      setTimeout(() => {
        this.dialogState = value;
      }, 300);
      // this.eventService.changeOverlayVisible(false);
    } else {
      this.currentState = value;

      setTimeout(() => {
        this.dialogState = value;
      }, 100);
      // this.eventService.changeOverlayVisible(true);
    }

  }

  getFileResponseDataAum(data) {
    this.subscriptionTab = data;
  }

  getSubscriptionTabChangeData(data) {
    this.selectedSubscriptionTab = data;
  }
}
