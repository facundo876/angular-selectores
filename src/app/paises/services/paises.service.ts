import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisesSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private urlBase : string = 'https://restcountries.com/v2'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

  get regiones(): string[]{
    return [...this._regiones];
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string ): Observable<PaisesSmall[]>{

    const url = `${ this.urlBase }/region/${ region }?fields=alpha3Code,name`;
    return this.http.get<PaisesSmall[]>(url);
  }

  getPaisPorCodigo( codigo: string ): Observable<Pais | null>{

    if(!codigo){
      return of(null);
    }

    const url = `${ this.urlBase }/alpha/${ codigo }`;
    return this.http.get<Pais>( url );
  }

  getPaisPorCodigoSmall( codigo: string ): Observable<Pais>{

    const url = `${ this.urlBase }/alpha/${ codigo }?fields=alpha3Code,name`;
    return this.http.get<Pais>( url );
  }

  getPaisePorCodigos( bordesrs: string[] ): Observable<PaisesSmall[]>{

    if(!bordesrs){
      return of([]);
    }

    const peticiones: Observable<PaisesSmall>[] = [];

    bordesrs.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
