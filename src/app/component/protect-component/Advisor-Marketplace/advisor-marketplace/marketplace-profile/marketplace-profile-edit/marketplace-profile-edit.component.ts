import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../../../Data-service/event.service';

@Component({
  selector: 'app-marketplace-profile-edit',
  templateUrl: './marketplace-profile-edit.component.html',
  styleUrls: ['./marketplace-profile-edit.component.scss']
})
export class MarketplaceProfileEditComponent implements OnInit {

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit() {
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
  }

}
