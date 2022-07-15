import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { MedicoService } from '../../../services/medico.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  hospitales!: Hospital[];
  hospitalSeleccionado!: Hospital | undefined;
  medicoSeleccionado!: Medico;

  constructor(private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.medicoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      hospital: new FormControl('', [Validators.required]),
    });

    this.medicoForm.get('hospital')?.valueChanges
      .subscribe(hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
      });

      this.obtenerMedicoPorID();
  }

  guardarMedico() {
    // console.log(this.medicoSeleccionado);

    if(this.medicoSeleccionado) {
      // * Actualiza el médico
      const _id = this.medicoSeleccionado._id;
      const {nombre, hospital} = this.medicoForm.value;
      // console.log(_id, nombre);
      this.medicoService.actualizarMedico(nombre, hospital, _id!).subscribe((resp: any) => {
        if(resp.ok) {
          Swal.fire('Actualizado', `${resp.medico.nombre} ha sido actualizado`, 'success');
        }
      })
    }else {
      // * Crea un nuevo médico
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          if(resp.ok) {
            Swal.fire('Agregado', `${resp.medico.nombre} ha sido agregado`, 'success');
            this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
          }
        });
    }
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe(resp => {
        this.hospitales = resp;
      });
  }

  obtenerMedicoPorID() {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.medicoService.obtenerMedicoPorID(id)
        .pipe(delay(100))
        .subscribe((medico: any) => {

          if(medico) {
            const { nombre } = medico;
            const _id = medico.hospital[0]._id;
  
            this.medicoSeleccionado = medico;
  
            this.medicoForm.setValue({nombre, hospital:_id});
          }
        });
    });
  }

}
