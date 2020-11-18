import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-finacial-plan-section',
  templateUrl: './finacial-plan-section.component.html',
  styleUrls: ['./finacial-plan-section.component.scss']
})
export class FinacialPlanSectionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  download() {
    let list = [{ url: 'pdf/summary', id: 1 }, { url: 'pdf/allTransactions', id: 2 }, { url: 'pdf/unrealisedTransactions', id: 3 },]
    list.forEach(element => {
      if (element.id == 1) {
        element.url = 'http://localhost:4200/' + element.url + '?' + 'advisorId=' + AuthService.getAdvisorId() + '&' + 'clientId=' + AuthService.getClientId() + '&' + 'parentId=0' + '&' + 'toDate=2020%2F11%2F18'
        window.open(element.url)
      } else if (element.id == 2) {
        element.url = 'http://localhost:4200/' + element.url + '?' + 'advisorId=' + AuthService.getAdvisorId() + '&' + 'clientId=' + AuthService.getClientId() + '&' + 'parentId=0' + '&' + 'toDate=2020%2F11%2F18' + '&' + 'fromDate=2019%2F11%2F18'
        window.open(element.url)
      } else if (element.id == 3) {
        element.url = 'http://localhost:4200/' + element.url + '?' + 'advisorId=' + AuthService.getAdvisorId() + '&' + 'clientId=' + AuthService.getClientId() + '&' + 'parentId=0' + '&' + 'toDate=2020%2F11%2F18'
        window.open(element.url)
      }
    });

  }
}
