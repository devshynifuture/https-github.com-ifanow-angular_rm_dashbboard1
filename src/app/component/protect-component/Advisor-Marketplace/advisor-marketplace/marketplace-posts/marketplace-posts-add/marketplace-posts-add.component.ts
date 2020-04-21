import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../../../Data-service/event.service';

@Component({
  selector: 'app-marketplace-posts-add',
  templateUrl: './marketplace-posts-add.component.html',
  styleUrls: ['./marketplace-posts-add.component.scss']
})
export class MarketplacePostsAddComponent implements OnInit {

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit() {
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
  }

}
