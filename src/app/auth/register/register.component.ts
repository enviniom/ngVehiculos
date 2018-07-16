import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService, User } from "../../services/auth.service";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { ToasterService, ToasterConfig, Toast } from "angular2-toaster";
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: "register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit, OnDestroy {
  email$: Observable<any>;
  subscriptionEmail: Subscription;
  emailExist: boolean = false;
  user: User;
  users$: Observable<User[]>;
  users: User[];
  registerForm: FormGroup;
  redirectDelay: number = 1000;
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  errorCodes: Object = {
    "auth/email-already-in-use": "El email ya está en uso",
    "auth/invalid-email": "Email no válido",
    "auth/operation-not-allowed": "Operación no permitida",
    "auth/weak-password": "Contraseña débil"
  };
  roles: Observable<any>;
  // Toast Notification declaration
  config: ToasterConfig;

  constructor(
    private fb: FormBuilder,
    protected as: AuthService,
    protected router: Router,
    private ts: ToasterService
  ) {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      pass: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(25)
        ])
      ],
      rol: ["", Validators.required],
      company: [""],
      name: ["", Validators.compose([Validators.required])],
      lastname: [""],
      photoUrl: [""]
    });
  }

  ngOnInit() {
    this.roles = this.as.getRol();
    this.users$ = this.as.getUsers();
    this.users$.subscribe(data => {
      this.users = data;
    });
    this.email$ = this.email.valueChanges;
    this.subscriptionEmail = this.email$.subscribe(value => {
      this.emailExist = this.emailSearchArray(value);
    });
    this.as.logout();
  }

  ngOnDestroy(): void {
    this.subscriptionEmail.unsubscribe();
  }

  submitRegister() {
    this.errors = [];
    this.user = this.prepareSaveUser();
    this.as.registerUser(this.user.email, this.pass).then((credential: firebase.auth.UserCredential) => {
          credential.user.sendEmailVerification();
          this.user.uid = credential.user.uid;
          this.showToast('success', '¡Genial!', 'Usuario creado satisfactoriamente');
          this.as.createUserDetails(this.user).then((res) => {
            console.log('respuesta createUserDetail ', res);
            this.showToast('success', '¡Estupendo!', 'Detalles de usuario creados satisfactoriamente');
            this.as.logout();
          }).catch((err) => {
            console.log('errores en detalles de usuario', err);
            this.showToast('error', '¡Que mal!', '¡Ocurrió un problema al crear los detalles de usuario!')
          })
        } // Rebuild Form
      ).catch(err => {
        if (this.errorCodes.hasOwnProperty(err.code)) {
          this.errors = [this.errorCodes[err.code]];
        } else {
          this.errors = [err];
        }
        this.showToast('error', '¡Changos!', 'No se creó el usuario');
      });
  }

  rebuildForm() {
    this.registerForm.reset();
  }

  prepareSaveUser(): User {
    const formModel = this.registerForm.value;
    const saveUser: User = {
      email: formModel.email as string,
      rol: formModel.rol as string,
      company: formModel.company as string,
      name: formModel.name as string,
      lastname: formModel.lastname as string,
      photoUrl: formModel.photoUrl as string
    };
    return saveUser;
  }

  revert() {
    this.rebuildForm();
  }

  get email() {
    return this.registerForm.get("email");
  }

  get pass() {
    return this.registerForm.get("pass");
  }

  get rol() {
    return this.registerForm.get("rol");
  }

  get company() {
    return this.registerForm.get("company");
  }

  get name() {
    return this.registerForm.get("name");
  }

  get lastname() {
    return this.registerForm.get("lastname");
  }

  get photoUrl() {
    return this.registerForm.get("photoUrl");
  }

  redirectToLogout() {
    setTimeout(() => {
      this.router.navigate(["auth/logout"]);
    }, this.redirectDelay);
  }

  // Comprobar si el email existe
  emailSearchArray(value): boolean {
    let test: boolean = false;
    this.users.forEach(element => {
      if (element.email.localeCompare(value) === 0) {
        test = true;
      }
    });
    return test;
  }

  // Build toast notificaction
  private showToast(type: string, title: string, body: string) {

    this.config = new ToasterConfig({
      newestOnTop: true,
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body
    };
    this.ts.popAsync(toast);
  }
}
