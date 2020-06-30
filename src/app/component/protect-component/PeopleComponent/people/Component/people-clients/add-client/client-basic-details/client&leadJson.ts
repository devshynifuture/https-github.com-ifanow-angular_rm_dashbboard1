import { AuthService } from 'src/app/auth-service/authService'

export function individualJson(Formgroup, emailList, mobileList) {
    let obj: any = {
        emailList,
        bio: null,
        martialStatusId: 0,
        pan: Formgroup.controls.pan.value,
        kycComplaint: 0,
        roleId: Formgroup.controls.role.value,
        genderId: parseInt(Formgroup.controls.gender.value),
        userName: Formgroup.controls.username.value,
        mobileList,
        referredBy: 0,
        name: Formgroup.controls.fullName.value,
        displayName: Formgroup.controls.fullName.value,
        bioRemarkId: 0,
        userType: 2,
        remarks: null,
        leadSource: (Formgroup.controls.leadSource.value != '') ? Formgroup.controls.leadSource.value : null,
        leadRating: (Formgroup.controls.leadRating.value != '') ? Formgroup.controls.leadRating.value : null,
        leadStatus: (Formgroup.controls.leaadStatus.value != '') ? Formgroup.controls.leaadStatus.value : null,
    }
    return obj;
}

export function minorJson(Formgroup, emailList, mobileList) {
    let obj =
    {
        emailList,
        bio: null,
        martialStatusId: 0,
        pan: Formgroup.controls.pan.value,
        kycComplaint: 0,
        roleId: Formgroup.controls.role.value,
        genderId: parseInt(Formgroup.controls.gender.value),
        userName: Formgroup.controls.username.value,
        mobileList,
        referredBy: 0,
        name: Formgroup.controls.minorFullName.value,
        // displayName: Formgroup.controls.fullName.value,
        bioRemarkId: 0,
        userType: 2,
        remarks: null,
    }
    return obj;
}

export function nonIndividualJson(Formgroup, emailList, mobileList) {
    let obj: any = {
        emailList,
        bio: null,
        martialStatusId: 0,
        pan: Formgroup.controls.comPan.value,
        kycComplaint: 0,
        roleId: Formgroup.controls.role.value,
        // genderId: parseInt(Formgroup.controls.gender.value),
        userName: Formgroup.controls.username.value,
        mobileList,
        referredBy: 0,
        name: Formgroup.controls.comName.value,
        displayName: Formgroup.controls.comName.value,
        bioRemarkId: 0,
        userType: 2,
        remarks: null,
        leadSource: (Formgroup.controls.leadSource.value != '') ? Formgroup.controls.leadSource.value : null,
        leadRating: (Formgroup.controls.leadRating.value != '') ? Formgroup.controls.leadRating.value : null,
        companyStatus: (Formgroup.value.comStatus != '') ? Formgroup.value.comStatus : null,
        leadStatus: (Formgroup.controls.leadStatus.value != '') ? Formgroup.controls.leadStatus.value : null,
        occupationId: (Formgroup.controls.comOccupation.value != '') ? Formgroup.controls.comOccupation.value : null,
    }
    return obj;
}