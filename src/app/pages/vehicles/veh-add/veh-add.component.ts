import { Component, OnInit, OnDestroy } from '@angular/core';
import { VehiclesService, Vehiculo } from '../../../services/vehicles.service';
import { AuditService } from '../../../services/audit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ToasterService, Toast } from 'angular2-toaster';

@Component({
  selector: 'veh-add',
  templateUrl: './veh-add.component.html',
  styleUrls: ['./veh-add.component.scss']
})
export class VehAddComponent implements OnInit, OnDestroy {

  public formVehCreate: FormGroup;
  private redirectDelay: number = 1000;
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
  public tipos: string[] = [
    "Camión",
    "Camioneta Sencilla",
    "Camioneta Doblecabina",
    "Campero",
    "Sedán"
  ];
  public estados: string[] = ['Activo', 'Inactivo'];
  public anios: string[] = [];
  public accion: string = 'Crear Vehículo';
  public horo: boolean = true;

  constructor(
    private vehS: VehiclesService,
    private auditS: AuditService,
    private fb: FormBuilder,
    private authS: AuthService,
    private toastS: ToasterService) {
  }

  buildForm(): void {
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
    this.showeHidraulico = true;
    this.buildForm();
    this.subscriptionVeh = this.vehS.getVehiculos().subscribe(data => {
      this.placas = [];
      data.forEach(element => {
        this.placas.push(element.placa);
      });
      console.log('Placas ', this.placas);
    });
    this.subscriptionPlaca = this.placa.valueChanges.subscribe(value => {
      this.placaExist = this.placaSearchArray(value);
    })
    this.subscriptionTipoVeh = this.tipo.valueChanges.subscribe(value => {
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
    }
    return saveVeh;
  }

  // Guardar el vehículo en la bd
  submitVehiculo() {
    this.errors = [];
    this.submitted = true;
    this.vehiculo = this.prepareSaveVeh();
    this.beautify();
    this.vehS.addVehiculo(this.vehiculo). then(res => {
      this.showToast('success', '¡Genial!', 'Vehículo creado satisfactoriamente');
      console.log('res doc ref', res);
      this.submitted = false;
      this.buildForm();
    }).catch(err => {
      if (this.errorCodes.hasOwnProperty(err.code)) {
        this.errors = [this.errorCodes[err.code]];
      } else {
        this.errors = [err];
      }
      this.submitted = false;
      this.showToast('error', '¡Changos!', 'No se creó el vehículo');
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
