import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { NbAuthResult } from "@nebular/auth";
import { tap } from "rxjs/operators";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  redirectDelay: number = 1000;
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  errorCodes: Object = {
    "auth/wrong-password": "Contraseña errada o el usuario no tiene contraseña",
    "auth/user-disabled": "Usuario deshabilitado",
    "auth/invalid-email": "El email no es válido",
    "auth/user-not-found": "El usuario no existe"
  };

  constructor(
    private fb: FormBuilder,
    protected authS: AuthService,
    protected router: Router
  ) {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      pass: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(25)
        ])
      ]
    });
  }

  ngOnInit() { }

  submitLogin() {
    this.errors = this.messages = [];
    this.submitted = true;

    this.authS.signInWithEmail(this.email.value, this.pass.value)
    .then((res) => {
      this.submitted = false;
      this.messages = ['Ultimo ingreso a la plataforma',res.user.metadata.lastSignInTime];
      this.redirectToDashboard();
      this.authS.subscribeUser();
    })
    .catch((err) => {
      this.submitted = false;
      this.errors = [err];
    })
  }

  get email() {
    return this.loginForm.get("email");
  }

  get pass() {
    return this.loginForm.get("pass");
  }

  redirectToDashboard() {
    console.log("Usuario loggeado inicia timer");
    setTimeout(() => {
      console.log("Inicia la redirección");
      this.router.navigate(["/pages/dashboard"]);
    }, this.redirectDelay);
  }
}
