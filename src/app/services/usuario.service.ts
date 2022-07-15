import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, map, tap, throwError, Observable, of, delay } from 'rxjs';

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario!: Usuario;

  constructor(private http: HttpClient, 
              private router: Router, 
              private ngZone: NgZone) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role!;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return { headers: {'x-token':this.token} };
  }

  guardarEnLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke('yluminexymeh@gmail.com', () => {
      // window.open('login','_self');
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });

    // TODO: Borrar menú
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, {headers: {'x-token': this.token}})
      .pipe(
        map((resp: any) => {
          const { nombre, google, email, role, img = '', uid } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
          this.guardarEnLocalStorage(resp.token, resp.menu);
          return true;
        }),
        catchError((error: HttpErrorResponse) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          this.guardarEnLocalStorage(resp.token, resp.menu);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => {
            Swal.fire('Error', error.error.msg, 'error');
          });
        })
      );
  }

  actualizarPerfil(data: {nombre: string, email: string, role: string | undefined}) {
    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => {
          Swal.fire('Error', error.error.msg, 'error');
        });
      })
    );
  }

  loginUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          this.guardarEnLocalStorage(resp.token, resp.menu);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => {
            Swal.fire('Error', error.error.msg, 'error');
          });
        })
      );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
    .pipe(
      tap((resp: any) => {
        this.guardarEnLocalStorage(resp.token, resp.menu);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => {
          Swal.fire('Error', error.error.msg, 'error');
        });
      })
    );
  }

  cargarUsuarios(from: number = 0) {
    return this.http.get<CargarUsuario>(`${base_url}/usuarios?from=${from}`, this.headers)
      .pipe(
        map((resp =>{
          const usuarios = resp.usuarios.map( user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid));
          return {
            total: resp.total,
            usuarios
          };
        })),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => {
            Swal.fire('Error', error.error.msg, 'error');
          });
        })
      );
  }

  actualizarUsuario(usuario: Usuario) {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => {
          Swal.fire('Error', error.error.msg, 'error');
        });
      })
    );
  }

  eliminarUsuario(usuario: Usuario) {
    return this.http.delete(`${base_url}/usuarios/${usuario.uid}`, this.headers)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => {
            Swal.fire('Error', error.error.msg, 'error');
          });
        })
      );
  }
}
