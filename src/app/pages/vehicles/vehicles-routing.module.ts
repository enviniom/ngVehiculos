import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehiclesComponent } from './vehicles.component';
import { VehListComponent } from './veh-list/veh-list.component';
import { VehViewComponent } from './veh-view/veh-view.component';
import { VehAddComponent,  } from './veh-add/veh-add.component';
import { AuthGuardAdmin } from '../../services/auth.guard';
import { VehEditComponent } from './veh-add/veh-edit.component';

const routes: Routes = [{
  path:'',
  component: VehiclesComponent,
  children: [{
    path: 'listar',
    component: VehListComponent,
  },
  {
    path: 'nuevo',
    component: VehAddComponent,
  },
  {
    path: ':idVehiculo',
    component: VehEditComponent,
  },
  {
    path: 'ver',
    component: VehViewComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclesRoutingModule { }

export const routedComponents = [
  VehiclesComponent,
  VehListComponent,
  VehViewComponent,
  VehAddComponent,
  VehEditComponent,
];
