import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisesSmall } from '../../interfaces/paises.interface';
import { pipe, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  });

  //llenar selectores
  regiones: string[] = [];
  paises: PaisesSmall[] = [];
  //fronteras: string[] = [];
  fronteras: PaisesSmall[] = [];

  //UI
  cargando: boolean = false;

  constructor( private fb: FormBuilder,
                private paisesService: PaisesService ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap( (_) =>{
            this.miFormulario.get('pais')?.reset('');
            this.cargando = true;
          } ),  
          switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
        )
        .subscribe( paises => {
          this.paises = paises;
          this.cargando = false;

        })

    this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( () => {
            this.fronteras = [];
            this.miFormulario.get('frontera')?.reset('');
            this.cargando = true;
          }),
          switchMap( alpha3Code => this.paisesService.getPaisPorCodigo( alpha3Code ) ),
          switchMap( pais => this.paisesService.getPaisePorCodigos(pais?.borders!) )
        )
        .subscribe( paises => {
          this.fronteras = paises
          this.cargando = false;
        } );
  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
