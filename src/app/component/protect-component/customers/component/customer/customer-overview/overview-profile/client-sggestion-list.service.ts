import { Injectable } from '@angular/core';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { CustomerOverviewService } from '../customer-overview.service';

@Injectable({
  providedIn: 'root'
})
export class ClientSggestionListService {

  constructor(private peopleService: PeopleService,
    private customerOverview: CustomerOverviewService) { }

  clientListusingMobile;
  clientListusingEmail;
  setSuggestionListUsingEmail(obj) {
    this.peopleService.getClientBasedOnEmail(obj).subscribe(
      data => {
        this.setSuggestionListUsingEmailRes(data)
      }
    )
  }

  setSuggestionListUsingEmailRes(data) {
    if (data) {
      this.customerOverview.suggestedClientListUsingEmail = data;
      this.clientListusingEmail = data
    }
  }

  setSuggestionListUsingMobile(obj) {
    this.peopleService.getClientBasedOnMobile(obj).subscribe(
      data => {
        this.setSuggestionListUsingMobileRes(data);
      }
    )
  }

  setSuggestionListUsingMobileRes(data) {
    if (data) {
      this.customerOverview.suggestedClientListUsingMobile = data;
      this.clientListusingMobile = data
    }
  }

  setEmptySuggestionList() {
    this.clientListusingEmail = undefined;
    this.clientListusingMobile = undefined
  }

  getSuggestionListUsingEmail() {
    return this.clientListusingEmail
  }
  getSuggestionListUsingMobile() {
    return this.clientListusingMobile
  }
}
