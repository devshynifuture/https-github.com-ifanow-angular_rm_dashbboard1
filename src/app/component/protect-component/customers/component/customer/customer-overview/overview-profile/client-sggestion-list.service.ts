import { Injectable } from '@angular/core';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Injectable({
  providedIn: 'root'
})
export class ClientSggestionListService {

  constructor(private peopleService: PeopleService) { }

  clientListusingMobile;
  clientListusingEmail;
  setSuggestionListUsingEmail(obj) {
    this.peopleService.getClientBasedOnEmail(obj).subscribe(
      data => {
        if (data) {
          this.clientListusingEmail = data
        }

      }
    )
  }

  setSuggestionListUsingMobile(obj) {
    this.peopleService.getClientBasedOnMobile(obj).subscribe(
      data => {
        if (data) {
          this.clientListusingMobile = data
        }
      }
    )
  }

  getSuggestionListUsingEmail() {
    return this.clientListusingEmail
  }
  getSuggestionListUsingMobile() {
    return this.clientListusingMobile
  }
}
