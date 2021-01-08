import { Router } from '@angular/router';
import { Injectable } from '@angular/core/src/metadata/*';
import { SettingsService } from '../component/protect-component/AdviserComponent/setting/settings.service';
import { UtilService } from '../services/util.service';
import { AuthService } from './authService';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private utilService: UtilService,
    private authService: AuthService
  ) {
    if (authService.isLoggedIn()) {
      const advisorRoleData = AuthService.getAdvisorRoles();
      if (advisorRoleData && advisorRoleData != undefined) {
        this.allPermissionData.next(advisorRoleData);
        this.constructAdminDataSource(advisorRoleData);
      }
      if (AuthService.getUserInfo()) {
        this.getRoleDetails(AuthService.getUserInfo().roleId, undefined);
      }
    }
  }

  subscriptionPermission = {
    enabled: true,
    subModule: {
      subscriptions: {
        enabled: true,
        subscriptionsCapabilityList: []
      },
      quotations: {
        enabled: true,
        quotationsCapabilityList: []
      },
      documents: {
        enabled: true,
        documentsCapabilityList: []
      },
      dashboard: {
        enabled: true,
      },
      invoices: {
        enabled: true,
        invoicesCapabilityList: []
      },
      clients: {
        enabled: true,
        subModule: {
          subscriptions: {
            enabled: true
          },
          quotations: {
            enabled: true
          },
          documents: {
            enabled: true
          },
          invoices: {
            enabled: true
          },
          settings: {
            enabled: true
          },
          subscriptionsCapabilityList: [],
          quotationsCapabilityList: [],
          documentsCapabilityList: [],
          invoicesCapabilityList: [],
          settingsCapabilityList: []
        }
      },
      settings: {
        enabled: true,
        settingsCapabilityList: []
      }
    }
  };
  portfolioPermission = {
    enabled: true,
  };
  transactionPermission = {
    enabled: true,
  };
  peoplePermission = {
    enabled: true,
    subModule: {
      clients: {
        enabled: true,
      },
      leads: {
        enabled: true,
      },
      clientsCapability: { add: true, edit: true, delete: true, download: true },
      leadsCapability: { add: true, edit: true, delete: true, download: true, convertToclient: true }
    }
  };
  backofficePermission = {
    enabled: true,
    subModule: {
      mis: {
        enabled: true,
      },
      fileuploads: {
        enabled: true,
      },
      duplicateData: {
        enabled: true,
      },
      foliomapping: {
        enabled: true,
      },
      folioquery: {
        enabled: true,
      },
      aumreconciliation: {
        enabled: true,
      },
      misCapability: { add: true, download: true, edit: true, delete: true },
      fileuploadsCapability: { download: true, add: true, edit: true, delete: true }
    }
  };
  dashboardPermission = {
    enabled: true,
    dashboardCapability: {
      Key_metrics: true,
      Activity_overview: true,
      Subscription_overview: true,
      To_do: true
    }
  };
  activityPermission = {
    enabled: true,
    subModule: {
      tasks: {
        enabled: true
      },
      emails: {
        enabled: true
      },
      calendar: {
        enabled: true
      },
      taskCapabilityList: [],
      calendarCapabilityList: [],
      emailCapabilityList: [],
      taskCapabilityObj: { add: true, edit: true, delete: true }
    }
  };
  overviewPermission = {
    enabled: true,
    subModules: {
      myFeed: {
        enabled: true
      },
      profile: {
        enabled: true,
        subModule: {
          keyInfo: { enabled: true },
          riskProfile: { enabled: true }
        },
        profileCapabilityObj: { add: true, edit: true, delete: true }
      },
      documents: {
        enabled: true,
        documentCapabilityObj: {
          // Share: true, Starred: false, Rename: true,
          // Download: true, Delete: true, Add: true
        } as any
      },
      subscriptions: {
        enabled: true,
        subModule: {
          settings: {
            enabled: true
          },
          documents: {
            enabled: true
          },
          invoices: {
            enabled: true
          },
          quotations: {
            enabled: true
          },
          subscriptions: {
            enabled: true
          }
        }
      }
    }
  };
  planPermission = {
    enabled: true,
  };
  settingPermission = {
    enabled: true,
  };
  familyMemberId: any;

  allPermissionData = new BehaviorSubject<any>({});

  getAllPermissionData() {
    return this.allPermissionData.asObservable();
  }

  getRoleDetails(roleId, callbackMethod: (args: any) => void) {
    // const observable = new Observable();
    this.settingsService.getAdvisorOrClientOrTeamMemberRoles({ id: roleId }).subscribe((res) => {
      console.log('roleService getRoleDetails response : ', res);
      if (callbackMethod) {
        callbackMethod(res);
      }
      if (res) {
        AuthService.setAdvisorRolesSettings(res);
        this.allPermissionData.next(res);
        this.constructAdminDataSource(res);
      }
    }, err => {
      if (callbackMethod) {
        callbackMethod(err);
      }
      console.log('roleService getRoleDetails err : ', err);
    });
    return;
  }

  constructAdminDataSource(adminDatasource) {
    for (const key in adminDatasource) {
      const subModules = adminDatasource[key];
      this.setPermissions(subModules.parentId, subModules.showModule);
      /* for (let i = 0; i < subModules.length; i++) {
         let segregated_permissions = this.utilService.segregateNormalAndAdvancedPermissions(subModules[i].capabilityList, subModules[i].childId);
         segregated_permissions = this.utilService.convertEnabledOrDisabledAsBoolean(segregated_permissions);
         delete subModules[i].capabilityList;
         subModules[i] = {
           ...subModules[i],
           ...segregated_permissions
         };
       }
       const obj = {
         modelName: subModules[0].parentName,
         subModules,
       };
       this.dataModels.push(obj);*/
    }
    if (AuthService.getUserInfo().userType == 1) {
      adminDatasource.subscriptions ? this.setSubscriptionSubModulePermissions(adminDatasource.subscriptions.subModule) : '';
      adminDatasource.people ? this.setPeoplePermissions(adminDatasource.people.subModule) : '';
      adminDatasource.activity ? this.setActivityPermissions(adminDatasource.activity.subModule) : '';
      adminDatasource.backoffice ? this.setBackofficePermissions(adminDatasource.backoffice.subModule) : this.backofficePermission.enabled = false;
      adminDatasource.dashboard ? this.setDashboardPermission(adminDatasource.dashboard.subModule) : '';
      adminDatasource.overview ? this.setOverviewPermissions(adminDatasource.overview.subModule) : '';
    } else {
      adminDatasource.overview ? this.setOverviewPermissions(adminDatasource.overview.subModule) : '';
    }
  }

  setPermissions(moduleId, enabled) {
    console.log(' moduleId : ', moduleId, ' enabled : ', enabled);
    if (moduleId == 92) {
      this.subscriptionPermission.enabled = enabled;
    } else if (moduleId == 23) {
      this.portfolioPermission.enabled = enabled;
    } else if (moduleId == 3) {
      this.peoplePermission.enabled = enabled;
    } else if (moduleId == 115) {
      this.backofficePermission.enabled = enabled;
    } else if (moduleId == 1) {
      this.dashboardPermission.enabled = enabled;
    } else if (moduleId == 66) {
      this.activityPermission.enabled = enabled;
    } else if (moduleId == 74) {
      this.transactionPermission.enabled = enabled;
    } else if (moduleId == 8) {
      this.overviewPermission.enabled = enabled;
    } else if (moduleId == 42) {
      this.planPermission.enabled = enabled;
    } else if (moduleId == 122) {
      this.settingPermission.enabled = enabled;
    }
    // if (moduleName == 'Subscriptions') {
    //   this.subscriptionPermission.enabled = enabled;
    // } else if (moduleName == 'Portfolio') {
    //   this.portfolioPermission.enabled = enabled;
    // } else if (moduleName == 'People') {
    //   this.peoplePermission.enabled = enabled;
    // } else if (moduleName == 'Back office') {
    //   this.backofficePermission.enabled = enabled;
    // }
  }

  setSubscriptionSubModulePermissions(subscriptionPermissions) {
    this.subscriptionPermission.subModule.subscriptions.enabled = subscriptionPermissions.subscriptions ? subscriptionPermissions.subscriptions.showModule : false;
    this.subscriptionPermission.subModule.quotations.enabled = subscriptionPermissions.quotations ? subscriptionPermissions.quotations.showModule : false;
    this.subscriptionPermission.subModule.documents.enabled = subscriptionPermissions.documents ? subscriptionPermissions.documents.showModule : false;
    this.subscriptionPermission.subModule.dashboard.enabled = subscriptionPermissions.dashboard ? subscriptionPermissions.dashboard.showModule : false;
    this.subscriptionPermission.subModule.invoices.enabled = subscriptionPermissions.invoices ? subscriptionPermissions.invoices.showModule : false;
    this.subscriptionPermission.subModule.clients.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.showModule : false;
    this.subscriptionPermission.subModule.settings.enabled = subscriptionPermissions.settings ? subscriptionPermissions.settings.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.subscriptions.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.subModule.subscriptions.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.quotations.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.subModule.quotations.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.invoices.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.subModule.invoices.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.documents.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.subModule.documents.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.settings.enabled = subscriptionPermissions.clients ? subscriptionPermissions.clients.subModule.settings.showModule : false;
    this.subscriptionPermission.subModule.clients.subModule.documentsCapabilityList = subscriptionPermissions.clients.subModule.documents.subModule.documents.capabilityList;
    this.subscriptionPermission.subModule.clients.subModule.invoicesCapabilityList = subscriptionPermissions.clients.subModule.invoices.subModule.invoices.capabilityList;
    this.subscriptionPermission.subModule.clients.subModule.subscriptionsCapabilityList = subscriptionPermissions.clients.subModule.subscriptions.subModule.subscriptions.capabilityList;
    this.subscriptionPermission.subModule.clients.subModule.quotationsCapabilityList = subscriptionPermissions.clients.subModule.quotations.subModule.quotations.capabilityList;
    this.subscriptionPermission.subModule.clients.subModule.settingsCapabilityList = subscriptionPermissions.clients.subModule.settings.subModule.settings.capabilityList;
    this.subscriptionPermission.subModule.subscriptions.subscriptionsCapabilityList = subscriptionPermissions.subscriptions.subModule.subscriptions.capabilityList;
    this.subscriptionPermission.subModule.quotations.quotationsCapabilityList = subscriptionPermissions.quotations.subModule.quotations.capabilityList;
    this.subscriptionPermission.subModule.invoices.invoicesCapabilityList = subscriptionPermissions.invoices.subModule.invoices.capabilityList;
    this.subscriptionPermission.subModule.documents.documentsCapabilityList = subscriptionPermissions.documents.subModule.documents.capabilityList;
  }

  setActivityPermissions(activityPermissions) {
    this.activityPermission.subModule.tasks.enabled = activityPermissions.tasks ? activityPermissions.tasks.showModule : false;
    this.activityPermission.subModule.emails.enabled = activityPermissions.emails ? activityPermissions.emails.showModule : false;
    this.activityPermission.subModule.calendar.enabled = activityPermissions.calendar ? activityPermissions.calendar.showModule : false;
    this.activityPermission.subModule.taskCapabilityList = activityPermissions.tasks.subModule.tasks.capabilityList;
    this.activityPermission.subModule.taskCapabilityObj = UtilService.getCapabilityMap(activityPermissions.tasks.subModule.tasks.capabilityList);
    this.activityPermission.subModule.calendarCapabilityList = activityPermissions.calendar.subModule.calendar.capabilityList;
    this.activityPermission.subModule.emailCapabilityList = activityPermissions.emails.subModule.emails.capabilityList;
  }

  setPeoplePermissions(peoplePermission) {
    this.peoplePermission.subModule.clients.enabled = peoplePermission.clients.showModule;
    this.peoplePermission.subModule.leads.enabled = peoplePermission.leads.showModule;
    this.peoplePermission.subModule.clientsCapability = UtilService.getDetailedCapabilityMap(peoplePermission.clients.subModule.clients.capabilityList);
    this.peoplePermission.subModule.leadsCapability = UtilService.getDetailedCapabilityMap(peoplePermission.leads.subModule.leads.capabilityList);
    this.peoplePermission.subModule.leadsCapability.convertToclient = peoplePermission.leads.subModule.leads.capabilityList[7].enabledOrDisabled == 1 ? true : false;
  }

  setBackofficePermissions(backOfficePermission) {
    this.backofficePermission.subModule.mis.enabled = backOfficePermission.mis.showModule;
    this.backofficePermission.subModule.fileuploads.enabled = backOfficePermission.fileuploads.showModule;
    this.backofficePermission.subModule.duplicateData.enabled = backOfficePermission.duplicateData.showModule;
    this.backofficePermission.subModule.foliomapping.enabled = backOfficePermission.foliomapping.showModule;
    this.backofficePermission.subModule.folioquery.enabled = backOfficePermission.folioquery.showModule;
    this.backofficePermission.subModule.aumreconciliation.enabled = backOfficePermission.aumreconciliation.showModule;
    this.backofficePermission.subModule.misCapability = UtilService.getDetailedCapabilityMap(backOfficePermission.mis.subModule.mis.capabilityList);
    this.backofficePermission.subModule.fileuploadsCapability = UtilService.getDetailedCapabilityMap(backOfficePermission.fileuploads.subModule.fileuploads.capabilityList);
  }

  setDashboardPermission(dashboardPermission) {
    this.dashboardPermission.enabled = dashboardPermission.advisorDashboard.showModule;
    for (const obj of dashboardPermission.advisorDashboard.subModule.advisorDashboard.capabilityList) {
      obj.capabilityName = obj.capabilityName.replace(' ', '_');
      this.dashboardPermission.dashboardCapability[obj.capabilityName] = obj.enabledOrDisabled == 1 ? true : false;
    }
  }

  setOverviewPermissions(overviewPermission) {
    this.overviewPermission.subModules.myFeed.enabled = overviewPermission.myFeedVisibility ? overviewPermission.myFeedVisibility.showModule : false;
    this.overviewPermission.subModules.documents.enabled = overviewPermission.documents ? overviewPermission.documents.showModule : false;
    if (overviewPermission.documents) {
      this.overviewPermission.subModules.documents.documentCapabilityObj = UtilService.convertArrayListToObject(overviewPermission.documents.subModule.documents.capabilityList);
    }
    if (overviewPermission.profile) {
      this.overviewPermission.subModules.profile.enabled = overviewPermission.profile.showModule;
      this.overviewPermission.subModules.profile.profileCapabilityObj = UtilService.getDetailedCapabilityMap(overviewPermission.profile.subModule.keyInfo.subModule.keyInfo.capabilityList);
      this.overviewPermission.subModules.profile.subModule.keyInfo.enabled = overviewPermission.profile.subModule.keyInfo.showModule;
      this.overviewPermission.subModules.profile.subModule.riskProfile.enabled = overviewPermission.profile.subModule.riskProfile.showModule;
    } else {
      this.overviewPermission.subModules.profile.enabled = false;
    }
    if (overviewPermission.subscriptions) {
      this.overviewPermission.subModules.subscriptions.enabled = overviewPermission.subscriptions.showModule;
      this.overviewPermission.subModules.subscriptions.subModule.settings.enabled = overviewPermission.subscriptions.subModule.settings.showModule;
      this.overviewPermission.subModules.subscriptions.subModule.subscriptions.enabled = overviewPermission.subscriptions.subModule.subscriptions.showModule;
      this.overviewPermission.subModules.subscriptions.subModule.documents.enabled = overviewPermission.subscriptions.subModule.documents.showModule;
      this.overviewPermission.subModules.subscriptions.subModule.invoices.enabled = overviewPermission.subscriptions.subModule.invoices.showModule;
      this.overviewPermission.subModules.subscriptions.subModule.quotations.enabled = overviewPermission.subscriptions.subModule.quotations.showModule;
    } else {
      this.overviewPermission.subModules.subscriptions.enabled = false;
    }
  }

  goToValidClientSideUrl() {
    let url;
    if (this.overviewPermission.enabled) {
      url = "/customer/detail/overview";
    }
    else if (this.portfolioPermission.enabled) {
      url = "/customer/detail/account";
    }
    else if (this.planPermission.enabled) {
      url = "/customer/detail/plan";
    }
    else if (this.activityPermission.enabled) {
      url = "/customer/detail/activity";
    }
    else {
      url = "/customer/detail/transact";
    }
    return url;
  }

}
