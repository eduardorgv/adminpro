import { Component, OnInit, OnDestroy } from '@angular/core';

import Swal from 'sweetalert2';

import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { Hospital } from '../../../models/hospital.model';
import { Subscription, delay } from 'rxjs';
import { BusquedaService } from '../../../services/busqueda.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  hospitales!: Hospital[];
  hospitalesTemp!: Hospital[];
  cargando: boolean = true;
  imgSubs!: Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedaService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(1000))
      .subscribe(img => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        this.hospitales = hospitales;
        this.hospitalesTemp = hospitales;
        this.cargando = false;
      });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id!, hospital.nombre)
      .subscribe((resp: any) => {
        if(resp.ok) {
          Swal.fire('Actualizado', hospital.nombre, 'success');
        }
      });
  }

  eliminarHospital(hospital: Hospital) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar al hospital ${hospital.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.eliminarHospital(hospital._id!)
      .subscribe((resp: any) => {
        if(resp.ok){
          Swal.fire('Eliminado', hospital.nombre, 'success');
          this.cargarHospitales();
        }
      }); 
      }
    });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Nuevo hopital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    });

    if(value!.trim().length > 0) {
      this.hospitalService.crearHospital(value!)
        .subscribe((resp: any) => {
          this.hospitales.push(resp.hospital);
        });
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id!, hospital.img);
  }

  buscar(term: string) {
    if(term.length !== 0) {
      this.busquedaService.buscar('hospitales', term)
        .subscribe((resp: Hospital[]) => {
          this.hospitales = resp;
        });
    }else {
      this.hospitales = this.hospitalesTemp;
    }
  }

}
