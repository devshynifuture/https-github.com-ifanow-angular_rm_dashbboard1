import { UtilService } from '../../../../../services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { OnlineTrasactionComponent } from './doTransaction/online-trasaction/online-trasaction.component';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { KnowYourCustomerComponent } from './know-your-customer/know-your-customer.component';
import { IinUccCreationComponent } from './IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';
import { VerifyMemberComponent } from './MandateCreation/verify-member/verify-member.component';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpService } from 'src/app/http-service/http-service';

@Component({
  selector: 'app-overview-transactions',
  templateUrl: './overview-transactions.component.html',
  styleUrls: ['./overview-transactions.component.scss']
})
export class OverviewTransactionsComponent implements OnInit {
  file: void;


  constructor(private subInjectService: SubscriptionInject, public eventService: EventService, private http: HttpService, ) { }

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  openNewTransaction() {
    const fragmentData = {
      flag: 'addNewTransaction',
      data: null,
      id: 1,
      state: 'open65',
      componentName: OnlineTrasactionComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }


  openNewCustomer() {
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: KnowYourCustomerComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );

  }

  openMandate(data) {
    const fragmentData = {
      flag: 'mandate',
      data,
      id: 1,
      state: 'open',
      componentName: VerifyMemberComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);

        if (UtilService.isRefreshRequired(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);

        }
        rightSideDataSub.unsubscribe();
      }
    );
  }
  openNewCustomerIIN() {
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: IinUccCreationComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );

  }


  soapCall() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://www.bsestarmf.in/StarMFFileUploadService/StarMFFileUploadService.svc/Secure', true);
    xmlhttp.setRequestHeader("Content-Type", "application/soap+xml; charset=utf-8; action=http://tempuri.org/IStarMFFileUploadService/GetPassword")
    const sr =
      `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFFileUploadService">
      <soap:Header/>
      <soap:Body>
         <tem:GetPassword>
            <tem:Param>
               <star:MemberId>19798</star:MemberId>
               <star:Password>india.2020</star:Password>
               <star:UserId>1979802</star:UserId>
            </tem:Param>
         </tem:GetPassword>
      </soap:Body>
   </soap:Envelope>`;

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          const xml = xmlhttp.responseXML;
          // Here I'm getting the value contained by the <return> node.
          const response_number = parseInt(xml.getElementsByTagName('return')[0].childNodes[0].nodeValue);
          // Print result square number.
          console.log(response_number);
        }
      }
    }
    // Send the POST request.
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.responseType = 'document';
    xmlhttp.send(sr);
  }
  uploadFile(file) {
    console.log('2324234324', file)
    this.file = file.target.files[0]
    this.nseUpload(this.file)
  }
  nseUpload(file) {


    const BASE_NSE_URL = 'https://www.nsenmf.com/';
    const fileuploadurl = BASE_NSE_URL + 'NMFIIImageUpload/ImageUpload/UPLOADIMG';
    const fileName = file

    const params = new HttpParams()
    
      .set('BrokCode', 'ARN-15348')
      .set('Appln_id', 'MFS15348')
      .set('Password', 'ju7w0cp2')
      .set('CustomerID', '5011864918')
      .set('ImageType', 'AC')
      .set('ImageFormat', 'TIF')
      .set('RefNo', '8000504');

    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': "*",
        // 'Access-Control-Allow-Methods': "POST, GET, OPTIONS, DELETE, PUT",
        // 'Access-Control-Allow-Headers': "append,delete,entries,foreach,get,has,keys,set,values,Authorization"
      }),
      params: params,
      body: file
    };
    
    this.http.post(fileuploadurl, fileName, httpOptions).subscribe((responseData) => {
      console.log('DocumentsComponent uploadFileRes responseData : ', responseData);

    });
  }
}
