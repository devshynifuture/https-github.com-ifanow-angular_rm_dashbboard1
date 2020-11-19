import { Component, OnInit, ComponentFactoryResolver, ComponentFactory, ViewContainerRef, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { delay } from 'rxjs/operators';
import { IncomeComponent } from '../income/income.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ExpensesComponent } from '../../../accounts/expenses/expenses.component';
import { InsuranceComponent } from '../../../accounts/insurance/insurance.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// import { InsuranceComponent } from '../../../accounts/insurance/insurance.component';

@Component({
  selector: 'app-finacial-plan-section',
  templateUrl: './finacial-plan-section.component.html',
  styleUrls: ['./finacial-plan-section.component.scss'],
  entryComponents: [
    IncomeComponent,
    ExpensesComponent,
    InsuranceComponent
  ]
})
export class FinacialPlanSectionComponent implements OnInit {
  loadedSection: any;
  fragmentData = { isSpinner: false }
  @ViewChild('pdfContainer', {
    read: ViewContainerRef,
    static: true
  }) container;
  moduleAdded: any;
  constructor(private util: UtilService, private resolver: ComponentFactoryResolver, private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.moduleAdded = []
  }
  // checkAndLoadPdf(value, sectionName) {
  //   if (value) {
  //     this.loadedSection = sectionName
  //   }
  // }


  getOutput(data) {
    console.log(data);
    this.generatePdf(data, '');
  }

  generatePdf(data, sectionName) {
    this.fragmentData.isSpinner = true;
    // let para = document.getElementById('template');
    // this.util.htmlToPdf(para.innerHTML, 'Test',this.fragmentData);
    this.util.htmlToPdf('', data.innerHTML, 'Income', 'true', this.fragmentData, '', '', false);
    this.moduleAdded.push({ name: sectionName })
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.moduleAdded, event.previousIndex, event.currentIndex);
    console.log(this.moduleAdded)
  }
  removeModule(module, i) {
    this.moduleAdded.splice(i, 1);
  }
  download() {
    // let list = [{ url: 'pdf/summary', id: 1 }, { url: 'pdf/allTransactions', id: 2 }, { url: 'pdf/unrealisedTransactions', id: 3 },]
    // list.forEach(element => {
    //   if (element.id == 1) {
    //     element.url = 'http://localhost:4200/' + element.url + '?' + 'advisorId=' + AuthService.getAdvisorId() + '&' + 'clientId=' + AuthService.getClientId() + '&' + 'parentId=0' + '&' + 'toDate=2020%2F11%2F18'
    //     window.open(element.url)
    //   } else if (element.id == 2) {
    //     element.url = 'http://localhost:4200/' + element.url + '?' + 'advisorId=' + AuthService.getAdvisorId() + '&' + 'clientId=' + AuthService.getClientId() + '&' + 'parentId=0' + '&' + 'toDate=2020%2F11%2F18' + '&' + 'fromDate=2019%2F11%2F18'
    //     window.open(element.url)
    //   } else if (element.id == 3) {
    //     element.url = 'http://localhost:4200/' + element.url + '?' + 'advisorId=' + AuthService.getAdvisorId() + '&' + 'clientId=' + AuthService.getClientId() + '&' + 'parentId=0' + '&' + 'toDate=2020%2F11%2F18'
    //     window.open(element.url)
    //   }
    // });

  }
  checkAndLoadPdf(value: any, sectionName: any) {
    let factory;
    if (value) {
      this.fragmentData.isSpinner = true;
      switch (sectionName) {
        case 'income':
          factory = this.resolver.resolveComponentFactory(IncomeComponent);
          break;
        case 'expense' || 'budget':
          factory = this.resolver.resolveComponentFactory(ExpensesComponent);
          break;
        case 'Life insurance' || 'General insurance':
          factory = this.resolver.resolveComponentFactory(InsuranceComponent);
          break;
      }
      const pdfContentRef = this.container.createComponent(factory);
      const pdfContent = pdfContentRef.instance;
      pdfContent.finPlanObj = { hideForFinPlan: true, sectionName: sectionName };
      const sub = pdfContent.loaded
        .pipe(delay(1))
        .subscribe(data => {
          console.log(data.innerHTML);
          this.fragmentData.isSpinner = false
          this.generatePdf(data, sectionName);
          console.log(pdfContent.loaded)
          sub.unsubscribe();
        })
    }


  }
}
