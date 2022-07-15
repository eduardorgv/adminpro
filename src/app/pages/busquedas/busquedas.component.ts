import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusquedaService } from 'src/app/services/busqueda.service';

import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.component.html',
  styles: [
  ]
})
export class BusquedasComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = []
  hospitales: Hospital[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private busquedaService: BusquedaService,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({term}) => this.busquedaGlobal(term))
  }

  busquedaGlobal(termino: string) {
    this.busquedaService.busquedaGlobal(termino)
      .subscribe((resp: any) => {
        this.usuarios = resp.usuarios;
        this.medicos = resp.medicos;
        this.hospitales = resp.hospitales;
      });
  }

  abrirMedico(medico: Medico) {
    this.router.navigateByUrl(`/dashboard/medico/${medico._id}`);
  }

  // abrirHospital(hospital: Hospital) {
  //   this.router.navigateByUrl(`/dashboard/medico/${hospital._id}`);
  // }

}
