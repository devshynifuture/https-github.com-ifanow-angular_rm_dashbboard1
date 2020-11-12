import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { MisAumDataStorageService } from './../../backoffice-mis/mutual-funds/aum/mis-aum-data-storage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from './../../../../../../common/link-bank/link-bank.component';
import { AuthService } from './../../../../../../auth-service/authService';
import { BackofficeFolioMappingService } from './../bckoffice-folio-mapping.service';
import { EventService } from './../../../../../../Data-service/event.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-select-folio-map',
  templateUrl: './select-folio-map.component.html',
  styleUrls: ['./select-folio-map.component.scss']
})
export class SelectFolioMapComponent implements OnInit {
  searchFamilyOrClientForm: FormGroup;
  isLoadingForDropDown = false;
  userNameInput = '';
  arrayOfFamilyMemberOrClient: any = [];
  errorMsg: string;
  arrayOfFamilyMemberOrClientError: boolean;
  parentId;
  selectedClientFullName: any = ''
  selectedClientGrpHeadName: any = ''
  selectedClientPan: any = '';
  selectedClientDob: any = '';
  selectedClientGrpHeadMobNum: any = '';
  selectedClientGrpHeadEmail: any = '';
  selectedClient: any;
  searchKeyword: any;
  selectedFolioInvestorName = '';
  advisorId;
  doShowDetails = false;
  clientId = AuthService.getClientId();

  constructor(
    public dialogRef: MatDialogRef<SelectFolioMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private eventService: EventService,
    private backOfcFolioMappingService: BackofficeFolioMappingService,
    private misAumDataStorageService: MisAumDataStorageService,
    private cusService: CustomerService
  ) { }


  ngOnInit() {
    this.initPoint();
  }

  initPoint() {
    this.advisorId = AuthService.getAdvisorId();
    if (this.data && this.data.selectedFolios && this.data.selectedFolios.length !== 0) {
      this.data.selectedFolios.forEach((element, index) => {
        if (index === this.data.selectedFolios.length - 1) {
          this.selectedFolioInvestorName += element.ownerName;
        } else {
          this.selectedFolioInvestorName += element.ownerName + ' &';
        }
      });
    }

    this.parentId = AuthService.getParentId();
    this.formInit();
  }

  setUserDetail(value, typedValue) {
    this.searchFamilyOrClientForm.controls['searchFamilyOrClient'].enable({ emitEvent: false });

    this.doShowDetails = true;
    this.searchKeyword = typedValue;
    this.selectedClient = value;
    this.userNameInput = value.showName;
    this.selectedClientFullName = value.showName;
    this.selectedClientGrpHeadName = value.showName;
    this.selectedClientPan = value.pan;
    this.selectedClientDob = value.birthDate;
    this.selectedClientGrpHeadMobNum = value.mobileNo;
    this.selectedClientGrpHeadEmail = value.emailId;
  }

  displayFn(value): string | undefined {
    return value ? value.name : undefined;
  }

  formInit() {
    this.searchFamilyOrClientForm = this.fb.group({
      searchFamilyOrClient: [, Validators.required]
    })
    this.searchFamilyOrClientValueChanges();
  }

  searchFamilyOrClientValueChanges() {
    this.searchFamilyOrClientForm.get('searchFamilyOrClient').valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.arrayOfFamilyMemberOrClient = [];
          this.isLoadingForDropDown = true;
        }),
        switchMap(value => this.getFamilyOrClientList(value)
          .pipe(
            finalize(() => {
              this.isLoadingForDropDown = false
            }),
          )
        )
      )
      .subscribe(data => {
        if (data && this.data.type === 'backoffice') {
          this.arrayOfFamilyMemberOrClient = data;
          this.arrayOfFamilyMemberOrClient.map(element => {
            element.showName = ''
          });
          this.arrayOfFamilyMemberOrClient.map(item => {
            if (item.familyId > 0) {
              item.showName = item.familyMemberName
            } else {
              item.showName = item.clientName
            }
          })
          console.log("this is advisor name::::::::", data);
          if (data && data['length'] > 0) {
            this.arrayOfFamilyMemberOrClientError = false;
          } else {
            this.arrayOfFamilyMemberOrClientError = true;
            this.errorMsg = 'No data Found';
          }
          console.log("this is some value", this.arrayOfFamilyMemberOrClient);
        } else if (data && this.data.type === 'casFileUpload') {
          this.arrayOfFamilyMemberOrClient = data;
          this.arrayOfFamilyMemberOrClient.map(item => {
            item.showName = item.displayName;
          })
          if (data && data['length'] > 0) {
            this.arrayOfFamilyMemberOrClientError = false;
          } else {
            this.arrayOfFamilyMemberOrClientError = true;
            this.errorMsg = 'No data Found';
          }
        } else {
          this.arrayOfFamilyMemberOrClientError = true;
          this.errorMsg = 'No data Found';
        }
      }, err => {
        this.arrayOfFamilyMemberOrClientError = true;
        this.errorMsg = 'Something went wrong';
        this.eventService.openSnackBar(err, "Dismiss");
      });
  }

  getFamilyOrClientList(value) {
    if (this.data.type === 'backoffice') {
      const data = {
        parentId: this.parentId === 0 ? this.advisorId : this.parentId,
        searchQuery: value,
      }
      return this.backOfcFolioMappingService.getUserDetailList(data)
    } else if (this.data.type === 'casFileUpload') {
      const data = {
        clientId: this.clientId
      }
      return this.cusService.getFamilyMemberListForCasMapping(data)
    }
  }

  mapFolio() {
    let data = [];
    let obj;
    if (this.data.selectedFolios.length !== 0) {
      this.data.selectedFolios.forEach(element => {
        obj = {
          advisorId: this.selectedClient.adminAdvisorId,
          clientId: this.selectedClient.groupHeadId,
          familyMemberId: this.selectedClient.familyId,
          folioNumber: element.folioNumber,
          parentId: this.parentId === 0 ? this.advisorId : this.parentId,
        }
        data.push(obj);
      });
    }

    this.backOfcFolioMappingService.putMutualFundInvestorDetail(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
          // update call responds with 200 refresh or else no refresh
          if (res.statusCode === 200) {
            this.misAumDataStorageService.clearStorage();
            this.misAumDataStorageService.callApiData();
            this.dialogClose(true);
          } else {
            this.dialogClose(false);
          }
          this.eventService.openSnackBar("Mapped Successfully !", "DISMISS");
        } else {
          this.eventService.openSnackBar("Something went wrong!", "DISMISS");
        }
      }, err => {
        this.eventService.openSnackBar("Something went wrong!", "DISMISS");
        console.error(err);
      })
  }

  dialogClose(refresh) {
    if (this.data.type === 'backoffice') {
      this.dialogRef.close({ refresh });
    } else if (this.data.type === 'casFileUpload') {
      this.dialogRef.close({ refresh, selectedFamilyMemberData: this.selectedClient })
    }
  }
}
