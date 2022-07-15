import { Component, OnDestroy, OnInit } from '@angular/core';
import { Medico } from '../../../models/medico.model';
import { Subscription, delay } from 'rxjs';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedaService } from 'src/app/services/busqueda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  medicos!: Medico[];
  medicosTemp!: Medico[];
  cargando: boolean = true;
  imgSubs!: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedaService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(1000))
      .subscribe(img => this.cargarMedicos());
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(resp => {
        this.medicos = resp;
        this.medicosTemp = resp;
        this. cargando = false;
      });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

  buscar(term: string) {
    if(term.length !== 0) {
      this.busquedaService.buscar('medicos', term)
        .subscribe((resp: Medico[]) => {
          this.medicos = resp;
        });
    }else {
      this.medicos = this.medicosTemp;
    }
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar al médico ${medico.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id!)
      .subscribe((resp: any) => {
        if(resp.ok){
          Swal.fire('Eliminado', medico.nombre, 'success');
          this.cargarMedicos();
        }
      }); 
      }
    });
  }

}
