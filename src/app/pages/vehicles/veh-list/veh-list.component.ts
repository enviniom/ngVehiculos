import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { VehiclesService, Vehiculo } from "../../../services/vehicles.service";
import { Router } from "@angular/router";
import { AuditService, Event } from "../../../services/audit.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "veh-list",
  templateUrl: "./veh-list.component.html",
  styleUrls: ["./veh-list.component.scss"]
})
export class VehListComponent implements OnInit, OnDestroy {
  private vehiculosSub: Subscription;
  private redirectDelay: number = 200;
  private e:Event;
  vehiculos: Vehiculo[];
  settings = {
    mode: "external",
    add: {
      addButtonContent: '<i class="nb-plus"></i>'
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: false,
    },
    columns: {
      placa: {
        title: "PLACA"
      },
      tipo: {
        title: "TIPO"
      },
      color: {
        title: "COLOR"
      },
      anio: {
        title: "AÑO"
      },
      marca: {
        title: "MARCA"
      }
    }
  };

  constructor(private vehS: VehiclesService,
    private authS: AuthService,
    protected router: Router,
    private auditS: AuditService,
  ) {}

  ngOnInit() {
    this.vehiculosSub = this.vehS.getVehiculos().subscribe(data => {
      this.vehiculos = data;
    });
  }

  ngOnDestroy() {
    this.vehiculosSub.unsubscribe();
  }

  onCreate(event) {
    setTimeout(() => {
      this.router.navigate(["/pages/vehiculos/nuevo"]);
    }, this.redirectDelay);
  }

  onDeleteConfirm(event): void {
    if (window.confirm("¿Está seguro de eliminar el vehículo?")) {
      console.log("Evento", event.data.id);
      this.vehS.deleteVehiculo(event.data.id).then(() => {
        this.e = {
          accion: "borrar",
          coleccion: "vehiculos",
          descripcion: "se eliminó el vehículo " + event.data.placa,
          fecha: new Date(),
          autor: this.authS.userDetails.email,
        }
        this.auditS.addEvent(this.e, 'vehiculosLog')
                    .then(res => console.log('res audit', res))
                    .catch(err => console.log('err audit', err))
      })
    }
  }

  onEdit(event): void {
    setTimeout(() => {
      this.router.navigate(["/pages/vehiculos",event.data.id])
    }, this.redirectDelay);
  }
}
