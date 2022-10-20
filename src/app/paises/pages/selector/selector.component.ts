import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html'
})
export class SelectorComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ["", Validators.required],
    pais: ["", Validators.required],
    frontera: ["", Validators.required],

  })

  regiones: string[] = [];

  paises: PaisSmall[] = []

  fronteras: string[] = []

  cargando:boolean=false;

  constructor(private paisesService: PaisesService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando=true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando=false;
      });

      this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando=true;

        }),
        switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo ) ),
      
      )
      .subscribe( pais => {
        this.cargando=false;
        if(pais!==null){
          console.log(pais[0].borders)
          this.fronteras=pais[0].borders
        }

      })
  }







  guardar() { }


}