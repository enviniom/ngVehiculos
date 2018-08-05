import { Component, OnInit, OnDestroy,  } from '@angular/core';
import { VehiclesService, Vehiculo } from '../../../services/vehicles.service';
import { AuditService, Event } from '../../../services/audit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ToasterService, Toast } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'veh-edit',
  templateUrl: './veh-add.component.html',
  styleUrls: ['./veh-add.component.scss']
})
export class VehEditComponent implements OnInit, OnDestroy {

  public formVehCreate: FormGroup;
  private id: string;
  private e: Event;
  public message: string;
  public errors: string[] = [];
  public submitted: boolean = false;
  private subscriptionVeh: Subscription;
  private subscriptionTipoVeh: Subscription;
  private subscriptionPlaca: Subscription;
  public placas: string[];
  public placaExist: boolean = false;
  public vehiculo: Vehiculo;
  public showeHidraulico: boolean;
  private errorCodes: object = {

  }
  public tipos: Object[] = [
    { tipo: "Camión", foto: "assets/vehiculos/cami.jpg"},
    { tipo: "Camioneta Sencilla", foto: "assets/vehiculos/case.jpg"},
    { tipo: "Camioneta Doblecabina", foto: "assets/vehiculos/doca.jpg"},
    { tipo: "Campero", foto: "assets/vehiculos/camp.jpg"},
    { tipo: "Sedán", foto: "assets/vehiculos/sedan.jpg"},
    { tipo: "Cabinado", foto: "assets/vehiculos/cabi.jpg"},
  ];
  public estados: string[] = ['Activo', 'Inactivo'];
  public anios: string[] = [];
  public accion: string = 'Actualizar Vehículo';
  public horo: boolean = true;

  constructor(
    private vehS: VehiclesService,
    private auditS: AuditService,
    private fb: FormBuilder,
    private authS: AuthService,
    private toastS: ToasterService,
    private ruta: ActivatedRoute,
    private router: Router,
  ) {
  }


  buildFormSi(): void {
    this.showeHidraulico = true;
    this.formVehCreate = this.fb.group({
      placa: [this.vehiculo.placa, Validators.compose([Validators.required, Validators.minLength(6)])],
      tipo: [this.vehiculo.tipo,],
      color: [this.vehiculo.color, Validators.required],
      anio: [this.vehiculo.anio,],
      marca: [this.vehiculo.marca, Validators.required],
      modelo: [this.vehiculo.modelo, ],
      an8: [this.vehiculo.an8, ],
      proveedor: [this.vehiculo.proveedor, ],
      contrato: [this.vehiculo.contrato, ],
      factura: [this.vehiculo.factura, ],
      estado: [this.vehiculo.estado, ],
      soat: this.vehiculo.soat,
      rtm: this.vehiculo.rtm,
      horometro: [this.vehiculo.horometro, ],
      notas: [this.vehiculo.notas, ],
      horasMant: [this.vehiculo.horasMant, ],
      responsable: [this.vehiculo.responsable, ],
      eHidraulico: [this.vehiculo.eHidraulico, ],
    })
  };

  buildFormNo(): void {
    this.showeHidraulico = true;
    this.formVehCreate = this.fb.group({
      placa: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      tipo: ['Camión',],
      color: ['', Validators.required],
      anio: ['2019',],
      marca: ['', Validators.required],
      modelo: ['', ],
      an8: ['', ],
      proveedor: ['', ],
      contrato: ['', ],
      factura: ['', ],
      estado: ['Activo', ],
      soat: ['', ],
      rtm: ['', ],
      horometro: ['', ],
      notas: ['', ],
      horasMant: ['', ],
      responsable: ['', ],
      eHidraulico: ['', ],
    })
  };

  get placa() { return this.formVehCreate.get('placa'); };
  get color() { return this.formVehCreate.get('color'); };
  get marca() { return this.formVehCreate.get('marca'); };
  get tipo() { return this.formVehCreate.get('tipo'); };

  ngOnInit() {
    this.message = 'Espere un momento, buscando el vehículo seleccionado';
    setTimeout(() => {
      this.message = '¡Oh vaya!, no se encontró el vehículo especificado'
    }, 10000);
    this.showeHidraulico = true;
    this.id = this.ruta.snapshot.params.idVehiculo;
    this.buildFormNo();
    this.subscriptionVeh = this.vehS.getVehiculos().subscribe(data => {
      this.placas = [];
      data.forEach(element => {
        if (element.id.localeCompare(this.id)===0) {
          this.vehiculo = element;
          console.log('vehiculo ', this.vehiculo);
          this.buildFormSi();
        } else {
          this.placas.push(element.placa);
        }
      });
      console.log('Placas ', this.placas);
    });
    this.subscriptionPlaca = this.placa.valueChanges.subscribe(value => {
      this.placaExist = this.placaSearchArray(value);
    })
    this.subscriptionTipoVeh = this.tipo.valueChanges.subscribe((value: string) => {
      this.tipos.forEach((tipoVeh: {tipo: string, url: string}) => {
        if (tipoVeh.tipo.localeCompare(value)===0) {
          this.formVehCreate.get('fotoUrl').setValue(tipoVeh.url)
        }
      });
      let s: string = 'Camión';
      if (s.localeCompare(value)===0) {
        this.showeHidraulico = true;
      } else {
        this.showeHidraulico = false;
        this.formVehCreate.get('eHidraulico').setValue('');
      }
    })
    // TODO: Hacer que tome el año inicial de la fecha del servidor
    for (let i = 0; i < 50; i++) {
      this.anios[i] = String(2019-i);
    }
  };

  ngOnDestroy() {
    if (this.subscriptionPlaca) {
      this.subscriptionPlaca.unsubscribe();
    };
    if (this.subscriptionVeh) {
      this.subscriptionVeh.unsubscribe();
    }
    if (this.subscriptionTipoVeh) {
      this.subscriptionTipoVeh.unsubscribe();
    }
  }

  // Preparar los datos del vehículo a guardar
  prepareSaveVeh(): Vehiculo {
    const formModel = this.formVehCreate.value;
    const saveVeh: Vehiculo = {
      placa: formModel.placa as string,
      tipo: formModel.tipo as string,
      color: formModel.color as string,
      anio: formModel.anio as string,
      marca: formModel.marca as string,
      modelo: formModel.modelo as string,
      an8: formModel.an8 as string,
      proveedor: formModel.proveedor as string,
      contrato: formModel.contrato as string,
      factura: formModel.factura as string,
      estado: formModel.estado as string,
      soat: formModel.soat as string,
      rtm: formModel.rtm as string,
      horometro: formModel.horometro as string,
      horasMant: formModel.horasMant as string,
      notas: formModel.notas as string,
      responsable: formModel.responsable as string,
      eHidraulico: formModel.eHidraulico as string,
      fechaCreacion: new Date(),
    }
    return saveVeh;
  }

  // Guardar el vehículo en la bd
  submitVehiculo() {
    this.errors = [];
    this.submitted = true;
    this.vehiculo = this.prepareSaveVeh();
    this.beautify();
    this.vehS.updateVehiculo(this.id, this.vehiculo).then(res => {
      this.showToast('success', '¡Genial!', 'Vehículo actualizado satisfactoriamente');
      console.log('res doc ref', res);
      this.submitted = false;
      this.buildFormSi();
      this.e = {
        accion: "editar",
        coleccion: "vehiculos",
        descripcion: "se actualizó el vehículo " + this.vehiculo.placa,
        fecha: new Date(),
        autor: this.authS.userDetails.email,
      }
      this.auditS.addEvent(this.e, 'vehiculosLog')
                    .then(res => console.log('res audit', res))
                    .catch(err => console.log('err audit', err));
      this.redirectToListar();
    }).catch(err => {
      if (this.errorCodes.hasOwnProperty(err.code)) {
        this.errors = [this.errorCodes[err.code]];
      } else {
        this.errors = [err];
      }
      this.submitted = false;
      this.showToast('error', '¡Chanfle!', 'No se actualizó el vehículo');
    });
  }

  testForm(): void {
    this.errors = [];
    this.submitted = true;
    this.vehiculo = this.prepareSaveVeh();
    this.beautify();
  }

  // Comprobar si la placa ya existe en la bd
  placaSearchArray(value: string): boolean {
    value = value.toUpperCase();
    let test: boolean = false;
    this.placas.forEach(element => {
      if (element.localeCompare(value) === 0) {
        test = true;
      };
    });
    return test;
  }

  // Arreglar los datos del vehículo al patrón estético establecido
  beautify() {
    if (this.vehiculo.placa) {
      this.vehiculo.placa = this.vehiculo.placa.trim();
      this.vehiculo.placa = this.vehiculo.placa.replace(" ","");
      this.vehiculo.placa = this.vehiculo.placa.toUpperCase();
    }
    if (this.vehiculo.color) {
      this.vehiculo.color = this.vehiculo.color.toLowerCase();
      this.vehiculo.color =
        this.vehiculo.color.charAt(0).toUpperCase() +
        this.vehiculo.color.slice(1);
    }
    if (this.vehiculo.marca) {
      this.vehiculo.marca = this.vehiculo.marca.trim();
      this.vehiculo.marca = this.vehiculo.marca.toUpperCase();
    }
    if (this.vehiculo.proveedor) {
      this.vehiculo.proveedor = this.vehiculo.proveedor.trim();
      this.vehiculo.proveedor = this.vehiculo.proveedor.toUpperCase();
    }
    if (this.vehiculo.contrato) {
      this.vehiculo.contrato = this.vehiculo.contrato.trim();
      this.vehiculo.contrato = this.vehiculo.contrato.toUpperCase();
    }
    if (this.vehiculo.factura) {
      this.vehiculo.factura = this.vehiculo.factura.trim();
      this.vehiculo.factura = this.vehiculo.factura.toUpperCase();
    }
    if (this.vehiculo.modelo) {
      this.vehiculo.modelo = this.vehiculo.modelo.trim();
      this.vehiculo.modelo = this.vehiculo.modelo.toUpperCase();
    }
    if (this.vehiculo.responsable) {
      this.vehiculo.responsable = this.vehiculo.responsable.trim();
      this.vehiculo.responsable = this.vehiculo.responsable.toUpperCase();
    }
    if (this.vehiculo.an8) {
      this.vehiculo.placa = this.vehiculo.placa.trim();
      this.vehiculo.placa = this.vehiculo.placa.toUpperCase();
    }
    if (this.vehiculo.proveedor) {
      this.vehiculo.proveedor = this.vehiculo.proveedor.trim();
      this.vehiculo.proveedor = this.vehiculo.proveedor.toUpperCase();
    }
    if (this.vehiculo.contrato) {
      this.vehiculo.contrato = this.vehiculo.contrato.trim();
      this.vehiculo.contrato = this.vehiculo.contrato.toUpperCase();
    }
    if (this.vehiculo.factura) {
      this.vehiculo.factura = this.vehiculo.factura.trim();
      this.vehiculo.factura = this.vehiculo.factura.toUpperCase();
    }
    if (this.vehiculo.notas) {
      this.vehiculo.notas = this.vehiculo.notas.trim();
      this.vehiculo.notas = this.vehiculo.notas.toLowerCase();
      this.vehiculo.notas =
        this.vehiculo.notas.charAt(0).toUpperCase() +
        this.vehiculo.notas.slice(1);
    }
  }

  redirectToListar() {
    setTimeout(() => {
      this.router.navigate(['pages/vehiculos/listar'])
    }, 2000);
  }

  // Build toast notificaction
  private showToast(type: string, title: string, body: string) {
    const toast: Toast = {
      type: type,
      title: title,
      body: body
    };
    this.toastS.popAsync(toast);
  }
}