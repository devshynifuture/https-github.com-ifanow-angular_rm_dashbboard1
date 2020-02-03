import { Component, OnInit } from '@angular/core';
import { AddPpfComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-ppf/add-ppf.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddSsyComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-ssy/add-ssy.component';
import { AddPoSavingComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-po-saving/add-po-saving.component';
import { AddPoTdComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-po-td/add-po-td.component';
import { AddPoRdComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-po-rd/add-po-rd.component';
import { AddPoMisComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-po-mis/add-po-mis.component';
import { AddScssComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-scss/add-scss.component';
import { AddKvpComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-kvp/add-kvp.component';
import { AddNscComponent } from '../../../../accounts/assets/smallSavingScheme/common-component/add-nsc/add-nsc.component';

@Component({
  selector: 'app-all-advice-small-savings-scheme',
  templateUrl: './all-advice-small-savings-scheme.component.html',
  styleUrls: ['./all-advice-small-savings-scheme.component.scss']
})
export class AllAdviceSmallSavingsSchemeComponent implements OnInit {

  displayedColumns: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'empcon', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  dataSource = ELEMENT_DATA;
  displayedColumns2: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  dataSource2 = ELEMENT_DATA2;
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA1;
  displayedColumns4: string[] = ['checkbox', 'name', 'desc','cvalue', 'advice', 'astatus', 'adate', 'icon'];
  dataSource4 = ELEMENT_DATA4;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject) { }
  allAdvice = true
  ngOnInit() {
  }
  openAddPPF(data) {
    const fragmentData = {
      flag: 'addPpf',
      data,
      id: 1,
      state: 'open',
      componentName: AddPpfComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getPpfSchemeData();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openAddNSC(data, flag) {
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open35' : 'open',
      componentName: AddNscComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
       
      }
    );
  }
  openAddKVP(data, flag) {
    const fragmentData = {
      flag: 'addKVP',
      data,
      id: 1,
      state: (flag == 'detailedKvp') ? 'open35' : 'open',
      componentName : AddKvpComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getKvpSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
       
      }
    );
  }
  openAddSCSS(data, flag) {
    const fragmentData = {
      flag: 'addSCSS',
      data,
      id: 1,
      state: (flag == 'detailedScss') ? 'open35' : 'open',
      componentName:  AddScssComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getScssSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
       
      }
    );
  }
  openAddPOMIS(data) {
    const fragmentData = {
      flag: 'addPOMIS',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoMisComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getPoMisSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
        
      }
    );
  }
  openAddPORD(data) {
    const fragmentData = {
      flag: 'addPORD',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoRdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getPoRdSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openAddPOTD(data) {
    const fragmentData = {
      flag: 'addPoTd',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoTdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getPoTdSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
        
      }
    );
  }
  openAddPOSAVING(data) {
    const fragmentData = {
      flag: 'addPOSAVING',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoSavingComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getPoSavingSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
        
      }
    );
  }
  addOpenSSY(data, flag) {
    const fragmentData = {
      flag: 'addSyss',
      data,
      id: 1,
      state: (flag == 'detailedSsy') ? 'open35' : 'open',
      componentName: AddSsyComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getSsySchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
export interface PeriodicElement1 {
  name: string;
  desc: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Rahul Jain', desc: '1', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
export interface PeriodicElement {
  name: string;
  desc: string;
  cvalue: string;
  empcon: string;
  emprcon: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Rahul Jain', desc: '1', cvalue: 'This is', empcon: '54000', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', cvalue: 'This is', empcon: '54000', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
export interface PeriodicElement2 {
  name: string;
  desc: string;
  cvalue: string;
  emprcon: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: 'Rahul Jain', desc: '1', cvalue: 'This is', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', cvalue: 'This is', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
export interface PeriodicElement4{
  name: string;
  desc: string;
  cvalue: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA4: PeriodicElement4[] = [
  { name: 'Rahul Jain', desc: '1', cvalue:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', cvalue:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];