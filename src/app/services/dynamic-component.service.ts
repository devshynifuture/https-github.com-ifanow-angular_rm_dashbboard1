import {
  ComponentFactoryResolver,
  Injectable,
} from '@angular/core';
import {DataComponent} from '../interfaces/data.component';

@Injectable()
export class DynamicComponentService {

  constructor(private factoryResolver: ComponentFactoryResolver) {
  }

  addDynamicComponent(viewContainerRef, component, data) {
    const componentFactory = this.factoryResolver.resolveComponentFactory(component);

    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance).data = data;
    // component.data = data;
    // console.log('componentRef: ', componentRef);
    // console.log('data: ', data);
    // console.log('component: ', component);

    return componentRef;
  }
}
