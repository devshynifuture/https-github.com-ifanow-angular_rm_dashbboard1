import {Component, OnInit, Inject} from '@angular/core';
// import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../../subscription-inject.service';

@Component({
  selector: 'app-upper-slider',
  templateUrl: './upper-slider.component.html',
  styleUrls: ['./upper-slider.component.scss'],
  animations: [
    trigger('upperRightSlider', [
      state('open', style({
        left: '40%'
      })),
      state('close', style({
        left: '100%'
      })),
      state('closeSlider', style({
        left: '100%'
      })),
      transition('close => open', [animate('0.3s')]),
      transition('open => close', [animate('0.1s')]),
      transition('open => closeSLider', [animate('0s')]),
      transition('closeSlider => open', [animate('0.3s')])
    ])
  ]
})

export class UpperSliderComponent implements OnInit {
  fragmentData;

  constructor(private eventService: EventService, private subinject: SubscriptionInject
              // public dialogRef: MatDialogRef<UpperSliderComponent>,
              // @Inject(MAT_DIALOG_DATA) public fragmentData: any
  ) {
    this.eventService.rightSliderData.subscribe(
      data => this.getTabValueData(data)
    );
    this.subinject.rightslider.subscribe(
      data => this.getStateData(data)
    );
    this.subinject.upperData.subscribe(
      data => this.getUpperDataValue(data)
    );
    this.eventService.upperSliderDataObs.subscribe(
      data => {
        console.log('DialogContainerComponent constructor upperSliderDataObs: ', data);

        this.fragmentData = data;
      }
    );
  }

  subscriptionTab: any;

  State;
  rightSliderData;
  upperData;

  Flag = 'planOverview';
  plan = 'planServices';
  documents = 'plansDocuments';
  plans = 'servicesPlans';
  clientDocuments = 'clientDocuments';
  servicesDocuments = 'servicesDocuments';
  blankOverview;

  ngOnInit() {
    console.log('UpperSlider constructor ngOnInit: ', this.fragmentData);

    this.State = 'close';
    if (this.fragmentData.Flag === 'plan') {
      this.upperData = this.fragmentData.planData;
    }
    if (this.fragmentData.Flag === 'services') {
      this.upperData = this.fragmentData.FeeData;
    }
    console.log('upperData', this.upperData);
    console.log(this.fragmentData);
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({state: 'close'});
    // this.dialogRef.close();
  }

  getStateData(data) {
    this.State = data;
  }

  getUpperDataValue(data) {
    this.upperData = data;
    console.log('upperData', this.upperData);
  }

  getTabValueData(data) {
    this.blankOverview = data;
    this.rightSliderData = data;
    console.log('value', data);
  }

  tabClick(event) {
    console.log(event);
    this.subscriptionTab = event.tab.textLabel;
  }


}
