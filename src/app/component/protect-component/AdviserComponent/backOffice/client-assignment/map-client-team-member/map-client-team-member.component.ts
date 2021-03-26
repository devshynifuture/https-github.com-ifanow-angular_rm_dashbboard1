import { BackOfficeService } from 'src/app/component/protect-component/AdviserComponent/backOffice/back-office.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-map-client-team-member',
  templateUrl: './map-client-team-member.component.html',
  styleUrls: ['./map-client-team-member.component.scss']
})
export class MapClientTeamMemberComponent implements OnInit {
  searchFamilyOrClientForm: any;
  arrayOfFamilyMemberOrClient: any;
  obj: any;
  selected: any;
  showMap: boolean;

  constructor(dialogRef: MatDialogRef<MapClientTeamMemberComponent>,
    private fb: FormBuilder,
    private backOfficeService: BackOfficeService,
    @Inject(MAT_DIALOG_DATA) public fragmentData: any
  ) { }

  ngOnInit() {
    //this.formInit()
    this.getTeamMember();
    console.log('fragmentdata', this.fragmentData)
  }
  formInit() {
    this.searchFamilyOrClientForm = this.fb.group({
      searchFamilyOrClient: [, Validators.required]
    });
  }
  getTeamMember() {
    const obj = {
      advisorId: AuthService.getAdvisorId(),
    };
    this.backOfficeService.searchByTeamMember(obj).subscribe(
      data => {
        console.log('getClientForAssignment ==', data)
        this.arrayOfFamilyMemberOrClient = data
        if (data == null) {
          this.arrayOfFamilyMemberOrClient = []
        }
        console.log(this.arrayOfFamilyMemberOrClient)
      }
    );
  }
  selectTeamMember(data) {
    this.selected = data
    this.showMap = true
  }
  mapClient(value, event) {
    if (value == "All" && event.checked == true) {
      // this.dataSource.data.forEach(element => {
      //   this.obj = []
      //   this.obj.push({ 'advisorId': AuthService.getAdvisorId(), 'clientId': element.clientId })
      // });
    } else {
      this.obj.push({ 'advisorId': AuthService.getAdvisorId(), 'clientId': value.clientId })
    }
    this.backOfficeService.mapClient(this.obj).subscribe(
      data => {
        console.log('getClientForAssignment ==', data)
        if (data == null) {
        }
        console.log(data)
      }
    );
  }

}
