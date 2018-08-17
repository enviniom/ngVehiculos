import { Component, OnInit, OnDestroy } from "@angular/core";
import { VehiclesService, Vehiculo } from "../../../services/vehicles.service";
import { AuditService, Evento } from "../../../services/audit.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { AuthService } from "../../../services/auth.service";
import { ToasterService, Toast } from "angular2-toaster";
import { AngularFireStorage } from "angularfire2/storage";
import { finalize } from "rxjs/operators";

@Component({
  selector: "veh-add",
  templateUrl: "./veh-add.component.html",
  styleUrls: ["./veh-add.component.scss"]
})
export class VehAddComponent implements OnInit, OnDestroy {
  public formVehCreate: FormGroup;
  private evtAudit: Evento; // Evento para la tabla de auditoría
  public errors: string[] = [];
  public submitted: boolean = false;
  private subscriptionVeh: Subscription;
  private subscriptionTipoVeh: Subscription;
  private subscriptionPlaca: Subscription;
  public placas: string[]; // Placas que existen en la bd
  public placaExist: boolean = false; // indica si la placa ya existe en la bd
  public vehiculo: Vehiculo;
  public showeHidraulico: boolean; // Muestra equipo hidráulico en la vista si es camión
  private errorCodes: object = {};
  public tipos: Object[] = [
    { tipo: "Camión", foto: "assets/vehiculos/cami.jpg" },
    { tipo: "Camioneta Sencilla", foto: "assets/vehiculos/case.jpg" },
    { tipo: "Camioneta Doblecabina", foto: "assets/vehiculos/doca.jpg" },
    { tipo: "Campero", foto: "assets/vehiculos/camp.jpg" },
    { tipo: "Sedán", foto: "assets/vehiculos/sedan.jpg" },
    { tipo: "Cabinado", foto: "assets/vehiculos/cabi.jpg" }
  ];
  public estados: string[] = ["Activo", "Inactivo"];
  public anios: string[] = []; // Numero del select "años" de la vista
  public accion: string = "Crear Vehículo"; // Del botón guardar o editar
  public horo: boolean = true;
  public message: string; // Mensaje para cuando se edita el vehículo

  // Variables para guardar la imágen del vehículo
  private imgPath: any; // // ruta de la imagen a subir, de no existir se usa la imagen por defecto
  private uploadPercent: Observable<number>;
  private downloadURL: Observable<string | null>;
  public percent: number = 0;

  constructor(
    private vehS: VehiclesService,
    private auditS: AuditService,
    private fb: FormBuilder,
    private authS: AuthService,
    private storage: AngularFireStorage,
    private toastS: ToasterService
  ) {}

  get placa() {
    return this.formVehCreate.get("placa");
  }
  get color() {
    return this.formVehCreate.get("color");
  }
  get marca() {
    return this.formVehCreate.get("marca");
  }
  get tipo() {
    return this.formVehCreate.get("tipo");
  }

  ngOnInit() {
    this.imgPath = null;
    // Timer para mostrar mensaje cuando el vehículo no existe
    this.message = "Espere un momento, buscando el vehículo seleccionado";
    setTimeout(() => {
      this.message = "¡Oh vaya!, no se encontró el vehículo especificado";
    }, 10000);
    this.showeHidraulico = true;
    this.buildForm();
    this.subscriptionVeh = this.vehS.getVehiculos().subscribe(data => {
      this.placas = [];
      data.forEach(element => {
        this.placas.push(element.placa);
      });
    });
    this.subscriptionPlaca = this.placa.valueChanges.subscribe(value => {
      this.placaExist = this.placaSearchArray(value);
    });
    this.subscriptionTipoVeh = this.tipo.valueChanges.subscribe(
      (value: string) => {
        let url = this.formVehCreate.get("fotoUrl").value;
        if (url.startsWith("assets")) {
          this.tipos.forEach((tipoVeh: { tipo: string; foto: string }) => {
            if (tipoVeh.tipo.localeCompare(value) === 0) {
              let s: string = tipoVeh.foto;
              this.formVehCreate.get("fotoUrl").setValue(s);
            }
          });
        }
        let s: string = "Camión";
        if (s.localeCompare(value) === 0) {
          this.showeHidraulico = true;
        } else {
          this.showeHidraulico = false;
          this.formVehCreate.get("eHidraulico").setValue("");
        }
      }
    );
    // TODO: Hacer que tome el año inicial de la fecha del servidor
    for (let i = 0; i < 50; i++) {
      this.anios[i] = String(2019 - i);
    }
    this.vehiculo = this.prepareSaveVeh();
  }

  ngOnDestroy() {
    if (this.subscriptionPlaca) {
      this.subscriptionPlaca.unsubscribe();
    }
    if (this.subscriptionVeh) {
      this.subscriptionVeh.unsubscribe();
    }
    if (this.subscriptionTipoVeh) {
      this.subscriptionTipoVeh.unsubscribe();
    }
  }

  buildForm(): void {
    this.showeHidraulico = true;
    this.formVehCreate = this.fb.group({
      placa: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      tipo: ["Camión"],
      color: ["", Validators.required],
      anio: ["2019"],
      marca: ["", Validators.required],
      modelo: [""],
      an8: [""],
      proveedor: [""],
      contrato: [""],
      factura: [""],
      estado: ["Activo"],
      soat: [""],
      rtm: [""],
      horometro: [""],
      notas: [""],
      horasMant: [""],
      responsable: [""],
      eHidraulico: [""],
      fotoUrl: ["assets/vehiculos/cami.jpg"]
    });
  }

  // Guardar el vehículo en la bd
  submitVehiculo(): void {
    this.errors = [];
    this.submitted = true;
    this.vehiculo = this.prepareSaveVeh();
    this.beautify();
    if (this.imgPath) {
      this.uploadFile(this.imgPath);
    } else {
      this.createVehiculo();
    }
  }

  createVehiculo(): void {
    this.vehS
      .addVehiculo(this.vehiculo)
      .then(res => {
        console.log("res", res);
        this.showToast(
          "success",
          "¡Genial!",
          "Vehículo creado satisfactoriamente"
        );
        this.submitted = false;
        this.buildForm();
        this.evtAudit = {
          accion: "crear",
          coleccion: "vehiculos",
          descripcion: "se creó el vehículo " + this.vehiculo.placa,
          fecha: new Date(),
          autor: this.authS.userDetails.email
        };
        this.auditS
          .addEvent(this.evtAudit, "vehiculosLog")
          .then(res => console.log("res audit", res))
          .catch(err => console.log("err audit", err));
      })
      .catch(err => {
        if (this.errorCodes.hasOwnProperty(err.code)) {
          this.errors = [this.errorCodes[err.code]];
        } else {
          this.errors = [err];
        }
        this.submitted = false;
        this.showToast("error", "¡Changos!", "No se creó el vehículo");
      });
  }

  prepareFile(event) {
    this.imgPath = event;
  }

  uploadFile(event): void {
    const file = event.target.files[0];
    const filePath = "vehiculosImg/" + this.vehiculo.placa;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observa cambios en el porcentaje
    this.uploadPercent = task.percentageChanges();
    // notifica cuando la url de descarga está lista
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            this.vehiculo.fotoUrl = url;
            this.createVehiculo();
            this.imgPath = null;
          }); // finaliza, no necesita unsubscribe
        })
      )
      .subscribe();
    this.uploadPercent.subscribe(n => (this.percent = n)); // finaliza, no necesita unsubscribe
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
      fotoUrl: formModel.fotoUrl as string
    };
    return saveVeh;
  }

  // Comprobar si la placa ya existe en la bd
  placaSearchArray(value: string): boolean {
    value = value.toUpperCase();
    let test: boolean = false;
    this.placas.forEach(element => {
      if (element.localeCompare(value) === 0) {
        test = true;
      }
    });
    return test;
  }

  // Arreglar los datos del vehículo al patrón estético establecido
  beautify() {
    if (this.vehiculo.placa) {
      this.vehiculo.placa = this.vehiculo.placa.trim();
      this.vehiculo.placa = this.vehiculo.placa.replace(" ", "");
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
  private showToast(type: string, title: string, body: string): void {
    const toast: Toast = {
      type: type,
      title: title,
      body: body
    };
    this.toastS.popAsync(toast);
  }
}
