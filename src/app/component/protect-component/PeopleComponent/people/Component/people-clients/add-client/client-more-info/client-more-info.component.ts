import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-client-more-info',
  templateUrl: './client-more-info.component.html',
  styleUrls: ['./client-more-info.component.scss']
})
export class ClientMoreInfoComponent implements OnInit {

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject) { }
  moreInfoForm;
  @Input() fieldFlag;
  @Output() tabChange = new EventEmitter();
  ngOnInit() {
    this.moreInfoForm = this.fb.group({
      displayName: [],
      adhaarNo: [],
      taxStatus: [],
      occupation: [],
      maritalStatus: [],
      anniversaryStatus: [],
      bio: [],
      myNotes: []
    })
  }
  saveNext() {
    this.tabChange.emit(1);
  }
  saveClose() {
    this.close();
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
