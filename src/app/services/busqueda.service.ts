import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: {'x-token':this.token} };
  }

  constructor(private http: HttpClient) { }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }

  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados.map(
      hospital => new Hospital(hospital.nombre, hospital._id, hospital.img)
    );
  }

  private transformMedicos(resultado: any[]): Medico[] {
    return resultado.map(
      medico => new Medico(medico.nombre, medico._id, medico.img, medico.usuario, medico.hospital)
    );
  }

  buscar(type: 'usuarios'|'medicos'|'hospitales', term: string) {
    return this.http.get<any[]>(`${base_url}/todo/coleccion/${type}/${term}`, this.headers)
      .pipe(
        map((resp:any) => {
          switch (type) {
            case 'usuarios':
              return this.transformarUsuarios(resp.resultados);
            case 'hospitales':
              return this.transformarHospitales(resp.resultados);
            case 'medicos':
              return this.transformMedicos(resp.resultados);
            default:
              return [];
          }
        })
      );
  }
}
