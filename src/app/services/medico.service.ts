import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: {'x-token':this.token} };
  }

  constructor(private http: HttpClient) { }

  cargarMedicos() {
    return this.http.get(`${base_url}/medicos`, this.headers)
      .pipe(
        map((resp: any) => resp.medicos)
      );
  }

  obtenerMedicoPorID(id: string) {
    return this.http.get(`${base_url}/medicos/${id}`, this.headers)
      .pipe(
        map((resp: any) => resp.medico)
      );
  }

  crearMedico(medico: {nombre: string, hospital: string}) {
    return this.http.post(`${base_url}/medicos`, medico, this.headers);
  }

  actualizarMedico(nombre: string, hospital: string, _id: string) {
    return this.http.put(`${base_url}/medicos/${_id}`, { nombre, hospital }, this.headers)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => {
            Swal.fire('Error', error.error.errors.usuario.msg, 'error');
          });
        })
      )
  }

  eliminarMedico(_id: string) {
    return this.http.delete(`${base_url}/medicos/${_id}`, this.headers);
  }
}
