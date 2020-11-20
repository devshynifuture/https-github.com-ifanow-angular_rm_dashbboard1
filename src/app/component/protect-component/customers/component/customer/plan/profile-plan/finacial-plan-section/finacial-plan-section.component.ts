import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ComponentFactory,
  ViewContainerRef,
  ViewChild
} from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { delay } from 'rxjs/operators';
import { IncomeComponent } from '../income/income.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ExpensesComponent } from '../../../accounts/expenses/expenses.component';
import { InsuranceComponent } from '../../../accounts/insurance/insurance.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MutualFundSummaryComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund-summary/mutual-fund-summary.component';
import { MutualFundComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund.component';
import { MutualFundOverviewComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { MutualFundUnrealizedTranComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';
import { LiabilitiesComponent } from '../../../accounts/liabilities/liabilities.component';
import { OtherPayablesComponent } from '../../../accounts/liabilities/other-payables/other-payables.component';

// import { InsuranceComponent } from '../../../accounts/insurance/insurance.component';

@Component({
  selector: 'app-finacial-plan-section',
  templateUrl: './finacial-plan-section.component.html',
  styleUrls: ['./finacial-plan-section.component.scss'],
  entryComponents: [
    IncomeComponent,
    ExpensesComponent,
    InsuranceComponent,
    MutualFundSummaryComponent,
    MutualFundOverviewComponent,
    MutualFundUnrealizedTranComponent,
    MutualFundComponent,
    LiabilitiesComponent,
    OtherPayablesComponent
  ]
})
export class FinacialPlanSectionComponent implements OnInit {
  loadedSection: any;
  fragmentData = { isSpinner: false };
  @ViewChild('pdfContainer', {
    read: ViewContainerRef,
    static: true
  }) container;
  moduleAdded: any;
  selected = 0;
  isLoading = false;
  panelOpenState = false;
  constructor(private util: UtilService, private resolver: ComponentFactoryResolver,
    private subInjectService: SubscriptionInject) {
  }


  ngOnInit() {
    this.moduleAdded = [];
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
    this.util.htmlToPdf('', data.innerHTML, sectionName, 'true', this.fragmentData, '', '', false);
    this.moduleAdded.push({ name: sectionName });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.moduleAdded, event.previousIndex, event.currentIndex);
    console.log(this.moduleAdded);
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
        case 'expense':
        case 'budget':
          factory = this.resolver.resolveComponentFactory(ExpensesComponent);
          break;
        case 'All life insurances':
        case 'Term insurance':
        case 'Traditional insurance':
        case 'Ulip insurance':
        case 'All General insurance':
        case 'Health insurance':
        case 'Personal accident':
        case 'Critical illness':
        case 'Motor insurance':
        case 'Travel insurance':
        case 'Home insurance':
        case 'Fire & special perils':
          factory = this.resolver.resolveComponentFactory(InsuranceComponent);
          break;
        case 'Mutual fund summary':
          factory = this.resolver.resolveComponentFactory(MutualFundSummaryComponent);
          break;
        case 'Mutual fund unrealised transaction':
          factory = this.resolver.resolveComponentFactory(MutualFundUnrealizedTranComponent);
          break;
        case 'Mutual fund all transaction':
          factory = this.resolver.resolveComponentFactory(MutualFundUnrealizedTranComponent);
          break;
        case 'Mutual fund overview':
          factory = this.resolver.resolveComponentFactory(MutualFundOverviewComponent);
          break;
        case 'All Liabltities':
        case 'Home':
        case 'Vehicle':
        case 'Education':
        case 'Personal':
        case 'Credit card':
        case 'Mortgage':
          factory = this.resolver.resolveComponentFactory(LiabilitiesComponent);
          break;
        case 'Others':
          factory = this.resolver.resolveComponentFactory(OtherPayablesComponent);
          break;
      }
      const pdfContentRef = this.container.createComponent(factory);
      const pdfContent = pdfContentRef.instance;
      pdfContent.finPlanObj = { hideForFinPlan: true, sectionName };
      const sub = pdfContent.loaded
        .pipe(delay(1))
        .subscribe(data => {
          console.log(data.innerHTML);
          this.fragmentData.isSpinner = false;
          this.generatePdf(data, sectionName);
          console.log(pdfContent.loaded);
          sub.unsubscribe();
        });
    }


  }
}
