import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-folio-master-details',
  templateUrl: './folio-master-details.component.html',
  styleUrls: ['./folio-master-details.component.scss']
})
export class FolioMasterDetailsComponent implements OnInit {
  inputData: any;
  folioDetails = [];

  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private eventService: EventService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getFolioMasterDetails(this.inputData)
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  getFolioMasterDetails(data) {
    const obj = {
      mfId: this.inputData.id
    }
    this.custumService.getMfFolioMaster(obj).subscribe(
      data => this.getFolioMasterResponse(data), (error) => {
        this.folioDetails = [];
      }
    );
  }
  getFolioMasterResponse(data) {
    console.log(data);
    // this.folioDetails=data.folioMasterList;
    if(data){
      this.folioDetails=data;
    }else{
      this.folioDetails = [];
    }
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

}
