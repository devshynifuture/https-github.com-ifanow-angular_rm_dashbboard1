import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-mandate',
  templateUrl: './detailed-view-mandate.component.html',
  styleUrls: ['./detailed-view-mandate.component.scss']
})
export class DetailedViewMandateComponent implements OnInit {
  data;
  details: any;
  transactionData:any;
  statusData = [
    {
      name: 'Pending authorization', checked: false, status: 0
    },
    {
      name: 'Form uploaded', checked: false, status: 4
    },
    {
      name: 'Accpted authorization', checked: false, status: 2
    },
    {
      name: 'Rejected authorization', checked: false, status: 3
    }
  ]
  statusDetails: any;

  constructor(private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
    this.details = this.data;
    console.log('mandateDetails', this.data);
    this.getDataStatus(this.details)
  }
  uploadFormFile(event){// for pro build param added

  }
  uploadFormImageUpload(event){// for pro build param added
    
  }
  getDataStatus(data) {
    this.statusDetails = this.statusData
    this.statusDetails.forEach(element => {
      (element.status <= data.status) ? element.checked = true : element.checked = false
    });
  }
  refresh(value){
    console.log(value);
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
