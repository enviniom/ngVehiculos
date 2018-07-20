import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule, routedComponents } from './vehicles-routing.module';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    VehiclesRoutingModule
  ],
  declarations: [ ...routedComponents,],
})
export class VehiclesModule { }
