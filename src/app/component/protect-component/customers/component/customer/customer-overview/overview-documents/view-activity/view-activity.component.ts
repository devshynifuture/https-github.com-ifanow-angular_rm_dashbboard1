import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss']
})
export class ViewActivityComponent implements OnInit {
  inputData: any;
  activityStatus = [
    {id: 1, name: 'Created'},
    {id: 2, name: 'Moved'},
    {id: 3, name: 'Starred'},
    {id: 4, name: 'Deleted'},
    {id: 5, name: 'Rename'},
    {id: 6, name: 'Copied'},
    {id: 7, name: 'Restore'},
    {id: 8, name: 'Trashed'}]
  showData: any;
  firstActivity: any;
  secondActivity: any;
  thirdActivity: any;
  constructor( public subInjectService: SubscriptionInject,) { }

  ngOnInit() {
    console.log(this.inputData)
    this.getData()
  }
  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }
  getData(){
    this.showData = this.inputData
    this.activityStatus.forEach(p => {
      this.showData.forEach(n => {
        if(n.actionId == p.id){
          n.actionId = p.name
        }
      });
    });
    console.log('viwActivity',this.showData)
    this.firstActivity = this.showData[0]
    this.secondActivity = this.showData[0]
    this.thirdActivity = this.showData[0]
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' })
  }
}
