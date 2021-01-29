import {Router, ActivatedRoute} from '@angular/router';
import {Injectable} from '@angular/core/src/metadata/*';
import {SettingsService} from '../component/protect-component/AdviserComponent/setting/settings.service';
import {UtilService} from '../services/util.service';
import {AuthService} from './authService';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private activatedRoute: ActivatedRoute,
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
        this.getRoleDetails(AuthService.getUserInfo().roleId, undefined)
        // (!AuthService.getClientData()) ? this.getRoleDetails(AuthService.getUserInfo().roleId, undefined) : this.getClientRoleDetails(AuthService.getClientData().roleId, undefined);
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
    subModule: {
      portfolioDashboard: {
        enabled: true
      },
      assets: {
        enabled: true,
        subModule: {
          cashAndBanks: {
            enabled: true,
            capabilityList: {} as any
          },
          commodities: {
            enabled: true,
            capabilityList: {} as any
          },
          fixedIncome: {
            enabled: true,
            capabilityList: {} as any
          },
          mutualFunds: {
            enabled: true,
            capabilityList: {} as any,
            subModule: {
              alltransactionsReport: {
                enabled: true,
                capabilityList: {} as any
              },
              capitalGains: {
                enabled: true,
                capabilityList: {} as any
              },
              manualTransactions: {
                enabled: true,
                capabilityList: {} as any
              },
              overviewReport: {
                enabled: true,
                capabilityList: {} as any
              },
              summaryReport: {
                enabled: true,
                capabilityList: [] as any
              },
              unrealizedTransactions: {
                enabled: true,
                capabilityList: {} as any
              },
            }
          },
          realEstate: {
            enabled: true,
            capabilityList: {} as any
          },
          retirementAccounts: {
            enabled: true,
            capabilityList: {} as any
          },
          smallSavingSchemes: {
            enabled: true,
            capabilityList: {} as any
          },
          stocks: {
            enabled: true,
            capabilityList: {} as any
          },
        }
      },
      insurance: {
        enabled: true,
        subModule: {
          generalInsurance: {
            enabled: true,
            capabilityList: {} as any
          },
          lifeInsurance: {
            enabled: true,
            capabilityList: {} as any
          }
        }
      },
      liabilities: {
        enabled: true,
        capabilityList: {} as any
      }
    }
  };
  transactionPermission = {
    enabled: true,
    subModule: {
      transactionsModule: {
        enabled: true
      },
      investorsModule: {
        enabled: true
      },
      mandateModule: {
        enabled: true
      }
    }
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
      clientsCapability: {add: true, edit: true, delete: true, download: true},
      leadsCapability: {add: true, edit: true, delete: true, download: true, convertToclient: true}
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
      misCapability: {add: true, download: true, edit: true, delete: true},
      fileuploadsCapability: {download: true, add: true, edit: true, delete: true}
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
      deployments: {
        enabled: true,
        capabilityList: {} as any
      },
      taskCapabilityList: [],
      calendarCapabilityList: [],
      emailCapabilityList: [],
      taskCapabilityObj: {add: true, edit: true, delete: true}
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
          keyInfo: {
            enabled: true,
            capabilityList: {} as any
          },
          riskProfile: {
            enabled: true,
            capabilityList: {} as any
          }
        },
        profileCapabilityObj: {add: true, edit: true, delete: true}
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
    subModule: {
      cashflows: {
        enabled: true
      },
      goals: {
        enabled: true,
        subModule: {
          preferences: {
            enabled: true,
            capabilityList: {} as any
          },
          allocations: {
            enabled: true,
            capabilityList: {} as any
          },
          calculators: {
            enabled: true,
            capabilityList: {} as any
          },
          keyInfo: {
            enabled: true,
          },
          mfAllocations: {
            enabled: true,
            capabilityList: {} as any
          }
        }
      },
      insurance: {
        enabled: true,
        capabilityList: {} as any
      },
      profile: {
        enabled: true,
        subModule: {
          income: {
            enabled: true,
            capabilityList: {} as any
          },
          expenses: {
            enabled: true,
            subModule: {
              budgets: {
                enabled: true,
                capabilityList: {} as any
              },
              transactions: {
                enabled: true,
                capabilityList: {} as any
              }
            }
          },
          financialPlan: {
            enabled: true,
            capabilityList: {} as any
          }
        }
      },
      scenarios: {
        enabled: true
      },
      summary: {
        enabled: true
      },
      taxes: {
        enabled: true
      }
    }
  };
  settingPermission = {
    enabled: true,
  };
  familyMemberId: any;

  allPermissionData = new BehaviorSubject<any>({});

  setDataInAllPermissionData(permissionData) {
    this.allPermissionData.next(permissionData);
  }

  getAllPermissionData() {
    return this.allPermissionData.asObservable();
  }

  getRoleDetails(roleId, callbackMethod: (args: any) => void,
                 failureMethod?: (args: any) => void ) {
    // const observable = new Observable();
    this.settingsService.getAdvisorOrClientOrTeamMemberRoles({id: roleId}).subscribe((res) => {
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
      if (failureMethod) {
        failureMethod(err);
      }
      console.log('roleService getRoleDetails err : ', err);
    });
    return;
  }

  getClientRoleDetails(roleId, callbackMethod: (args: any) => void,failureMethod?: (args: any) => void) {
    // const observable = new Observable();
    this.settingsService.getAdvisorOrClientOrTeamMemberRoles({id: roleId}).subscribe((res) => {
      console.log('roleService getRoleDetails response : ', res);
      if (callbackMethod) {
        callbackMethod(res);
      }
      if (res) {
        AuthService.setAdvisorRolesSettings(res);
        this.allPermissionData.next(res);
        this.constructClientDataSource(res);
      }
    }, err => {
      if (failureMethod) {
        failureMethod(err);
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
      // adminDatasource.activity ? this.setActivityPermissions(adminDatasource.activity.subModule) : '';
      adminDatasource.backoffice ? this.setBackofficePermissions(adminDatasource.backoffice.subModule) : this.backofficePermission.enabled = false;
      adminDatasource.dashboard ? this.setDashboardPermission(adminDatasource.dashboard.subModule) : '';
      adminDatasource.overview ? this.setOverviewPermissions(adminDatasource.overview.subModule) : '';
      adminDatasource.plan ? this.setPlanPermission(adminDatasource.plan.subModule) : this.planPermission.enabled = false;
    } else {
      adminDatasource.overview ? this.setOverviewPermissions(adminDatasource.overview.subModule) : '';
      adminDatasource.plan ? this.setPlanPermission(adminDatasource.plan.subModule) : this.planPermission.enabled = false;
    }
    adminDatasource.activity ? this.setActivityPermissions(adminDatasource.activity.subModule) : '';
    adminDatasource.transact ? this.setTransactionPermission(adminDatasource.transact.subModule) : this.transactionPermission.enabled = false;
    adminDatasource.portfolio ? this.setPortfolioPermission(adminDatasource.portfolio) : this.portfolioPermission.enabled = false;
  }

  constructClientDataSource(clientDatasource) {
    for (const key in clientDatasource) {
      const subModules = clientDatasource[key];
      this.setClientPermissions(subModules.parentId, subModules.showModule);
    }
    clientDatasource.activity ? this.setActivityPermissions(clientDatasource.activity.subModule) : '';
    clientDatasource.transact ? this.setTransactionPermission(clientDatasource.transact.subModule) : this.transactionPermission.enabled = false;
    clientDatasource.portfolio ? this.setPortfolioPermission(clientDatasource.portfolio) : this.portfolioPermission.enabled = false;
    clientDatasource.overview ? this.setOverviewPermissions(clientDatasource.overview.subModule) : '';
    clientDatasource.plan ? this.setPlanPermission(clientDatasource.plan.subModule) : this.planPermission.enabled = false;
  }

  setClientPermissions(moduleId, enabled) {
    if (moduleId == 66) {
      this.activityPermission.enabled = enabled;
    } else if (moduleId == 74) {
      this.transactionPermission.enabled = enabled;
    } else if (moduleId == 8) {
      this.overviewPermission.enabled = enabled;
    } else if (moduleId == 42) {
      this.planPermission.enabled = enabled;
    } else if (moduleId == 23) {
      this.portfolioPermission.enabled = enabled;
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
    if (activityPermissions.tasks) {
      this.activityPermission.subModule.tasks.enabled = activityPermissions.tasks.showModule;
      this.activityPermission.subModule.taskCapabilityList = activityPermissions.tasks.subModule.tasks.capabilityList;
      this.activityPermission.subModule.taskCapabilityObj = UtilService.getCapabilityMap(activityPermissions.tasks.subModule.tasks.capabilityList);
    } else {
      this.activityPermission.subModule.tasks.enabled = false;
    }
    if (activityPermissions.calendar) {
      this.activityPermission.subModule.calendarCapabilityList = activityPermissions.calendar.subModule.calendar.capabilityList;
      this.activityPermission.subModule.calendar.enabled = activityPermissions.calendar.showModule;
    } else {
      this.activityPermission.subModule.calendar.enabled = false;
    }
    if (activityPermissions.emails) {
      this.activityPermission.subModule.emails.enabled = activityPermissions.emails ? activityPermissions.emails.showModule : false;
      this.activityPermission.subModule.emailCapabilityList = activityPermissions.emails.subModule.emails.capabilityList;
    } else {
      this.activityPermission.subModule.emails.enabled = false;
    }
    if (activityPermissions.deployments) {
      this.activityPermission.subModule.deployments.enabled = activityPermissions.deployments.showModule;
      this.activityPermission.subModule.deployments.capabilityList = activityPermissions.deployments ? UtilService.convertArrayListToObject(activityPermissions.deployments.subModule.deployments.capabilityList) : {};
    } else {
      this.activityPermission.subModule.deployments.enabled = false;
    }
  }

  setPeoplePermissions(peoplePermission) {
    if (peoplePermission.clients) {
      this.peoplePermission.subModule.clients.enabled = peoplePermission.clients.showModule;
      this.peoplePermission.subModule.clientsCapability = UtilService.getDetailedCapabilityMap(peoplePermission.clients.subModule.clients.capabilityList);
    } else {
      this.peoplePermission.subModule.clients.enabled = false;
    }
    if (peoplePermission.leads) {
      this.peoplePermission.subModule.leads.enabled = peoplePermission.leads.showModule;
      this.peoplePermission.subModule.leadsCapability = UtilService.getDetailedCapabilityMap(peoplePermission.leads.subModule.leads.capabilityList);
      this.peoplePermission.subModule.leadsCapability.convertToclient = peoplePermission.leads.subModule.leads.capabilityList[7].enabledOrDisabled == 1 ? true : false;
    } else {
      this.peoplePermission.subModule.leads.enabled = false;
    }
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
      if (overviewPermission.profile.subModule.keyInfo) {
        this.overviewPermission.subModules.profile.subModule.keyInfo.enabled = overviewPermission.profile.subModule.keyInfo.showModule;
        this.overviewPermission.subModules.profile.subModule.keyInfo.capabilityList = UtilService.convertArrayListToObject(overviewPermission.profile.subModule.keyInfo.subModule.keyInfo.capabilityList);
      } else {
        this.overviewPermission.subModules.profile.subModule.keyInfo.enabled = false;
      }
      if (overviewPermission.profile.subModule.riskProfile) {
        this.overviewPermission.subModules.profile.subModule.riskProfile.enabled = overviewPermission.profile.subModule.riskProfile.showModule;
        this.overviewPermission.subModules.profile.subModule.riskProfile.capabilityList = UtilService.convertArrayListToObject(overviewPermission.profile.subModule.riskProfile.subModule.riskProfile.capabilityList);
      } else {
        this.overviewPermission.subModules.profile.subModule.riskProfile.enabled = overviewPermission.profile.subModule.riskProfile = false;
      }
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

  setPortfolioPermission(portfolioPermission) {
    this.portfolioPermission.subModule.portfolioDashboard.enabled = portfolioPermission.subModule.portfolioDashboard ? portfolioPermission.subModule.portfolioDashboard.showModule : false;
    if (portfolioPermission.subModule.insurance) {
      this.portfolioPermission.subModule.insurance.enabled = portfolioPermission.subModule.insurance.showModule;
      this.portfolioPermission.subModule.insurance.subModule.generalInsurance.enabled = portfolioPermission.subModule.insurance.subModule.generalInsurance.showModule;
      this.portfolioPermission.subModule.insurance.subModule.lifeInsurance.enabled = portfolioPermission.subModule.insurance.subModule.lifeInsurance.showModule;
      this.portfolioPermission.subModule.insurance.subModule.generalInsurance.capabilityList = UtilService.convertArrayListToObject(portfolioPermission.subModule.insurance.subModule.generalInsurance.subModule.generalInsurance.capabilityList);
      this.portfolioPermission.subModule.insurance.subModule.lifeInsurance.capabilityList = UtilService.convertArrayListToObject(portfolioPermission.subModule.insurance.subModule.lifeInsurance.subModule.lifeInsurance.capabilityList);
    } else {
      this.portfolioPermission.subModule.insurance.enabled = false;
    }
    if (portfolioPermission.subModule.liabilities) {
      this.portfolioPermission.subModule.liabilities.enabled = portfolioPermission.subModule.liabilities.showModule;
      this.portfolioPermission.subModule.liabilities.capabilityList = UtilService.convertArrayListToObject(portfolioPermission.subModule.liabilities.subModule.liabilities.capabilityList);
    } else {
      this.portfolioPermission.subModule.liabilities.enabled = false;
    }
    if (portfolioPermission.subModule.cashAndBanks) {
      this.portfolioPermission.subModule.assets.subModule.cashAndBanks.enabled = portfolioPermission.subModule.cashAndBanks.showModule
      this.portfolioPermission.subModule.assets.subModule.cashAndBanks.capabilityList = UtilService.convertArrayListToObject(portfolioPermission.subModule.cashAndBanks.subModule.cashAndBanks.capabilityList);
    } else {
      this.portfolioPermission.subModule.assets.subModule.cashAndBanks.enabled = false
    }
    if (portfolioPermission.subModule.commodities) {
      this.portfolioPermission.subModule.assets.subModule.commodities.enabled = portfolioPermission.subModule.commodities.showModule
      this.portfolioPermission.subModule.assets.subModule.commodities.capabilityList = UtilService.convertArrayListToObject(portfolioPermission.subModule.commodities.subModule.commodities.capabilityList);
    } else {
      this.portfolioPermission.subModule.assets.subModule.commodities.enabled = false;
    }
    if (portfolioPermission.subModule.fixedIncome) {
      this.portfolioPermission.subModule.assets.subModule.fixedIncome.enabled = portfolioPermission.subModule.fixedIncome.showModule
      this.portfolioPermission.subModule.assets.subModule.fixedIncome.capabilityList = UtilService.convertArrayListToObject(portfolioPermission.subModule.fixedIncome.subModule.fixedIncome.capabilityList);
    } else {
      this.portfolioPermission.subModule.assets.subModule.fixedIncome.enabled = false
    }
    if (portfolioPermission.subModule.realEstate) {
      this.portfolioPermission.subModule.assets.subModule.realEstate.enabled = portfolioPermission.subModule.realEstate.showModule
      this.portfolioPermission.subModule.assets.subModule.realEstate.capabilityList = UtilService.convertArrayListToObject(portfolioPermission.subModule.realEstate.subModule.realEstate.capabilityList);
    } else {
      this.portfolioPermission.subModule.assets.subModule.realEstate.enabled = false
    }
    if (portfolioPermission.subModule.retirementAccounts) {
      this.portfolioPermission.subModule.assets.subModule.retirementAccounts.enabled = portfolioPermission.subModule.retirementAccounts.showModule
      this.portfolioPermission.subModule.assets.subModule.retirementAccounts.capabilityList = UtilService.convertArrayListToObject(portfolioPermission.subModule.retirementAccounts.subModule.retirementAccounts.capabilityList);
    } else {
      this.portfolioPermission.subModule.assets.subModule.retirementAccounts.enabled = false
    }
    if (portfolioPermission.subModule.smallSavingSchemes) {
      this.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.enabled = portfolioPermission.subModule.smallSavingSchemes.showModule
      this.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.capabilityList = UtilService.convertArrayListToObject(portfolioPermission.subModule.smallSavingSchemes.subModule.smallSavingSchemes.capabilityList);
    } else {
      this.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.enabled = false
    }
    if (portfolioPermission.subModule.stocks) {
      this.portfolioPermission.subModule.assets.subModule.stocks.enabled = portfolioPermission.subModule.stocks.showModule
      this.portfolioPermission.subModule.assets.subModule.stocks.capabilityList = UtilService.convertArrayListToObject(portfolioPermission.subModule.stocks.subModule.stocks.capabilityList);
    } else {
      this.portfolioPermission.subModule.assets.subModule.stocks.enabled = false
    }


    this.portfolioPermission.subModule.assets.subModule.mutualFunds.enabled = portfolioPermission.subModule.mutualFunds ? portfolioPermission.subModule.mutualFunds.showModule : false
    this.portfolioPermission.subModule.assets.subModule.mutualFunds.capabilityList = portfolioPermission.subModule.mutualFunds ? UtilService.convertArrayListToObject(portfolioPermission.subModule.mutualFunds.subModule.manualTransactions.subModule.manualTransactions.capabilityList) : {}
    this.portfolioPermission.subModule.assets.subModule.mutualFunds.subModule.overviewReport.enabled = portfolioPermission.subModule.mutualFunds.subModule.overviewReport ? portfolioPermission.subModule.mutualFunds.subModule.overviewReport.showModule : false;
    this.portfolioPermission.subModule.assets.subModule.mutualFunds.subModule.summaryReport.enabled = portfolioPermission.subModule.mutualFunds.subModule.summaryReport ? portfolioPermission.subModule.mutualFunds.subModule.summaryReport.showModule : false;
    this.portfolioPermission.subModule.assets.subModule.mutualFunds.subModule.alltransactionsReport.enabled = portfolioPermission.subModule.mutualFunds.subModule.alltransactionsReport ? portfolioPermission.subModule.mutualFunds.subModule.alltransactionsReport.showModule : false;
    this.portfolioPermission.subModule.assets.subModule.mutualFunds.subModule.unrealizedTransactions.enabled = portfolioPermission.subModule.mutualFunds.subModule.unrealizedTransactions ? portfolioPermission.subModule.mutualFunds.subModule.unrealizedTransactions.showModule : false;
    this.portfolioPermission.subModule.assets.subModule.mutualFunds.subModule.capitalGains.enabled = portfolioPermission.subModule.mutualFunds.subModule.capitalGains ? portfolioPermission.subModule.mutualFunds.subModule.capitalGains.showModule : false;
    this.portfolioPermission.subModule.assets.subModule.mutualFunds.subModule.overviewReport.capabilityList = portfolioPermission.subModule.mutualFunds.subModule.overviewReport ? UtilService.convertArrayListToObject(portfolioPermission.subModule.mutualFunds.subModule.overviewReport.subModule.overviewReport.capabilityList) : {}
    this.portfolioPermission.subModule.assets.subModule.mutualFunds.subModule.summaryReport.capabilityList = portfolioPermission.subModule.mutualFunds.subModule.summaryReport ? portfolioPermission.subModule.mutualFunds.subModule.summaryReport.subModule.summaryReport.capabilityList : []
    this.portfolioPermission.subModule.assets.subModule.mutualFunds.subModule.alltransactionsReport.capabilityList = portfolioPermission.subModule.mutualFunds.subModule.alltransactionsReport ? UtilService.convertArrayListToObject(portfolioPermission.subModule.mutualFunds.subModule.alltransactionsReport.subModule.alltransactionsReport.capabilityList) : {}
    this.portfolioPermission.subModule.assets.subModule.mutualFunds.subModule.unrealizedTransactions.capabilityList = portfolioPermission.subModule.mutualFunds.subModule.unrealizedTransactions ? UtilService.convertArrayListToObject(portfolioPermission.subModule.mutualFunds.subModule.unrealizedTransactions.subModule.unrealizedTransactions.capabilityList) : {}
    this.portfolioPermission.subModule.assets.subModule.mutualFunds.subModule.capitalGains.capabilityList = portfolioPermission.subModule.mutualFunds.subModule.capitalGains ? UtilService.convertArrayListToObject(portfolioPermission.subModule.mutualFunds.subModule.capitalGains.subModule.capitalGains.capabilityList) : {}
  }

  setPlanPermission(planPermission) {
    this.planPermission.enabled = planPermission.plan.showModule
    this.planPermission.subModule.summary.enabled = planPermission.plan.subModule.summary ? planPermission.plan.subModule.summary.showModule : false;
    if (planPermission.plan.subModule.profile) {
      this.planPermission.subModule.profile.enabled = planPermission.plan.subModule.profile.showModule;
      this.planPermission.subModule.profile.subModule.income.enabled = planPermission.plan.subModule.profile.subModule.income.showModule;
      this.planPermission.subModule.profile.subModule.income.capabilityList = UtilService.convertArrayListToObject(planPermission.plan.subModule.profile.subModule.income.subModule.income.capabilityList)
      this.planPermission.subModule.profile.subModule.expenses.enabled = planPermission.plan.subModule.profile.subModule.expenses.showModule;
      this.planPermission.subModule.profile.subModule.expenses.subModule.budgets.enabled = planPermission.plan.subModule.profile.subModule.expenses.subModule.budgets.showModule;
      this.planPermission.subModule.profile.subModule.expenses.subModule.transactions.enabled = planPermission.plan.subModule.profile.subModule.expenses.subModule.transactions.showModule;
      this.planPermission.subModule.profile.subModule.expenses.subModule.budgets.capabilityList = UtilService.convertArrayListToObject(planPermission.plan.subModule.profile.subModule.expenses.subModule.budgets.subModule.budgets.capabilityList);
      this.planPermission.subModule.profile.subModule.expenses.subModule.transactions.capabilityList = UtilService.convertArrayListToObject(planPermission.plan.subModule.profile.subModule.expenses.subModule.transactions.subModule.transactions.capabilityList);
      this.planPermission.subModule.profile.subModule.financialPlan.enabled = planPermission.plan.subModule.profile.subModule.financialPlan.showModule;
      this.planPermission.subModule.profile.subModule.financialPlan.capabilityList = UtilService.convertArrayListToObject(planPermission.plan.subModule.profile.subModule.financialPlan.subModule.financialPlan.capabilityList)
    } else {
      this.planPermission.subModule.profile.enabled = false;
    }
    if (planPermission.plan.subModule.goals) {
      this.planPermission.subModule.goals.enabled = planPermission.plan.subModule.goals.showModule
      this.planPermission.subModule.goals.subModule.allocations.enabled = planPermission.plan.subModule.goals.subModule.allocations.showModule
      this.planPermission.subModule.goals.subModule.mfAllocations.enabled = planPermission.plan.subModule.goals.subModule.mfAllocations.showModule
      this.planPermission.subModule.goals.subModule.keyInfo.enabled = planPermission.plan.subModule.goals.subModule.keyInfo.showModule
      this.planPermission.subModule.goals.subModule.preferences.enabled = planPermission.plan.subModule.goals.subModule.preferences.showModule
      this.planPermission.subModule.goals.subModule.calculators.enabled = planPermission.plan.subModule.goals.subModule.calculators.showModule
      this.planPermission.subModule.goals.subModule.allocations.capabilityList = UtilService.convertArrayListToObject(planPermission.plan.subModule.goals.subModule.allocations.subModule.allocations.capabilityList);
      this.planPermission.subModule.goals.subModule.mfAllocations.capabilityList = UtilService.convertArrayListToObject(planPermission.plan.subModule.goals.subModule.mfAllocations.subModule.mfAllocations.capabilityList);
      this.planPermission.subModule.goals.subModule.preferences.capabilityList = UtilService.convertArrayListToObject(planPermission.plan.subModule.goals.subModule.preferences.subModule.preferences.capabilityList);
      this.planPermission.subModule.goals.subModule.calculators.capabilityList = UtilService.convertArrayListToObject(planPermission.plan.subModule.goals.subModule.calculators.subModule.calculators.capabilityList);
    } else {
      this.planPermission.subModule.goals.enabled = false;
    }
    this.planPermission.subModule.insurance.enabled = planPermission.plan.subModule.insurance ? planPermission.plan.subModule.insurance.showModule : false;
    this.planPermission.subModule.insurance.capabilityList = planPermission.plan.subModule.insurance ? UtilService.convertArrayListToObject(planPermission.plan.subModule.insurance.subModule.insurance.capabilityList) : false

    this.planPermission.subModule.taxes.enabled = planPermission.plan.subModule.taxes ? planPermission.plan.subModule.taxes.showModule : false
    this.planPermission.subModule.cashflows.enabled = planPermission.plan.subModule.cashflows ? planPermission.plan.subModule.cashflows.showModule : false
    this.planPermission.subModule.scenarios.enabled = planPermission.plan.subModule.scenarios ? planPermission.plan.subModule.scenarios.showModule : false

  }

  setTransactionPermission(transactionPermission) {
    this.transactionPermission.subModule.transactionsModule.enabled = transactionPermission.transactionsModule.showModule
    this.transactionPermission.subModule.investorsModule.enabled = transactionPermission.investorsModule.showModule
    this.transactionPermission.subModule.mandateModule.enabled = transactionPermission.mandateModule.showModule
  }

  goToValidClientSideUrl() {
    let url;
    if (this.overviewPermission.enabled) {
      if (this.overviewPermission.subModules.myFeed.enabled) {
        return url = '/customer/detail/overview/myfeed'
      }
      if (this.overviewPermission.subModules.profile.enabled) {
        return url = '/customer/detail/overview/profile'
      }
      if (this.overviewPermission.subModules.documents.enabled) {
        return url = '/customer/detail/overview/documents'
      }
      if (this.overviewPermission.subModules.subscriptions.subModule.subscriptions.enabled) {
        return url = '/customer/detail/overview/subscription/subscriptions';
      }
      if (this.overviewPermission.subModules.subscriptions.subModule.quotations.enabled) {
        return url = '/customer/detail/overview/subscription/quotations';
      }
      if (this.overviewPermission.subModules.subscriptions.subModule.invoices.enabled) {
        return url = '/customer/detail/overview/subscription/invoices';
      }
      if (this.overviewPermission.subModules.subscriptions.subModule.documents.enabled) {
        return url = '/customer/detail/overview/subscription/documents';
      }
      if (this.overviewPermission.subModules.subscriptions.subModule.settings.enabled) {
        return url = '/customer/detail/overview/subscription/settings';
      }

    } else if (this.portfolioPermission.enabled) {
      // return url = "/customer/detail/account";
      if (this.portfolioPermission.subModule.portfolioDashboard.enabled) {
        return url = "/customer/detail/account/summary"
      }
      if (this.portfolioPermission.subModule.assets.subModule.cashAndBanks.enabled) {
        return url = '/customer/detail/account/assets/cash_bank';
      }
      if (this.portfolioPermission.subModule.assets.subModule.mutualFunds.enabled) {
        return url = '/customer/detail/account/assets/mutual';
      }
      if (this.portfolioPermission.subModule.assets.subModule.fixedIncome.enabled) {
        return url = '/customer/detail/account/assets/fix';
      }
      if (this.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.enabled) {
        return url = '/customer/detail/account/assets/small';
      }
      if (this.portfolioPermission.subModule.assets.subModule.commodities.enabled) {
        return url = '/customer/detail/account/assets/commodities';
      }
      if (this.portfolioPermission.subModule.assets.subModule.stocks.enabled) {
        return url = '/customer/detail/account/assets/stock';
      }
      if (this.portfolioPermission.subModule.assets.subModule.realEstate.enabled) {
        return url = '/customer/detail/account/assets/real';
      }
      if (this.portfolioPermission.subModule.assets.subModule.retirementAccounts.enabled) {
        return url = '/customer/detail/account/assets/retire';
      }
      // else{}
      // if (state.url === '/customer/detail/account/assets/others') {
      //   return true;
      // }
      if (this.portfolioPermission.subModule.liabilities.enabled) {
        return url = "/customer/detail/account/liabilities"
      }
      if (this.portfolioPermission.subModule.insurance.enabled) {
        return url = "/customer/detail/account/insurance"
      }
    } else if (this.planPermission.enabled) {
      if (this.planPermission.subModule.profile.enabled) {
        return url = "/customer/detail/plan/profile"
      }
      if (this.planPermission.subModule.goals.enabled) {
        return url = "/customer/detail/plan/goals"
      }
    } else if (this.activityPermission.enabled) {
      return url = "/customer/detail/activity";
    } else {
      if (this.transactionPermission.subModule.transactionsModule.enabled) {
        return url = '/customer/detail/transact/list'
      }
      if (this.transactionPermission.subModule.investorsModule.enabled) {
        return url = '/customer/detail/transact/investors'
      }
      if (this.transactionPermission.subModule.mandateModule.enabled) {
        return url = '/customer/detail/transact/mandate'
      }
    }
  }

}
