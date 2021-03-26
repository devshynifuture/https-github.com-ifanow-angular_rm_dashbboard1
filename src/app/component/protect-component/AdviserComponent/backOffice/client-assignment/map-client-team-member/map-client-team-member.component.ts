import { BackOfficeService } from 'src/app/component/protect-component/AdviserComponent/backOffice/back-office.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
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

  constructor(dialogRef: MatDialogRef<MapClientTeamMemberComponent>,
    @Inject(MAT_DIALOG_DATA) private fb: FormBuilder,
    private backOfficeService: BackOfficeService
  ) { }

  ngOnInit() {
    //this.formInit()
    this.getTeamMember();
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
}
