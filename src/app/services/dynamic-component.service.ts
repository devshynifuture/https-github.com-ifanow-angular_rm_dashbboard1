import {
  ComponentFactoryResolver,
  Injectable,
} from '@angular/core';

@Injectable()
export class DynamicComponentService {

  constructor(private factoryResolver: ComponentFactoryResolver) {
  }

  addDynamicComponent(viewContainerRef, component, data) {
    const componentFactory = this.factoryResolver.resolveComponentFactory(component);

    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    componentRef.data = data;
    return componentRef;
  }
}
