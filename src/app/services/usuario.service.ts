import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, map, tap, throwError, Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, 
              private router: Router, 
              private ngZone: NgZone) { }

  logout() {
    localStorage.removeItem('token');
    google.accounts.id.revoke('yluminexymeh@gmail.com', () => {
      // window.open('login','_self');
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {headers: {'x-token': token}})
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        }),
        map(resp => true),
        catchError((error: HttpErrorResponse) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        }),
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
          localStorage.setItem('token', resp.token);
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
        localStorage.setItem('token', resp.token);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => {
          Swal.fire('Error', error.error.msg, 'error');
        });
      })
    );
  }
}
