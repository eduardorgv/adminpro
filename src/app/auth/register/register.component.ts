import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fnpasswordsIguales } from '../validator';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm: FormGroup = new FormGroup({
    nombre: new FormControl('Eduardo', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('test1@gamil.com', [Validators.required, Validators.email]),
    password: new FormControl('123456', [Validators.required]),
    password2: new FormControl('123456', [Validators.required]),
    terminos: new FormControl(true, [Validators.required]),
  }, {
    validators: fnpasswordsIguales
  });

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if(this.registerForm.invalid) {
      return;
    }

    // * Realizar posteo del usuario
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(resp => {
        if(resp.ok) {
          this.router.navigateByUrl('/');
        }
      });
  }

  campoNoValido(campo: string): boolean {
    if(this.registerForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    return ((pass1 !== pass2) && this.formSubmitted) ? true : false;
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

}
