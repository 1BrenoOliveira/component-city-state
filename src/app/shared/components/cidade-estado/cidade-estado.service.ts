import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { Estado } from './Estado';
import { Cidade } from './Cidade';

@Injectable({
  providedIn: 'root'
})
export class CidadeEstadoService {

  private readonly API: string = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'

  constructor(private http: HttpClient) { }

  listarEstado(){
    return this.http.get<Estado[]>(this.API + "?orderBy=nome").pipe(take(1));
  }

  pesquisarCidades(estado: number){
    return this.http.get<Cidade[]>(this.API+"/"+ estado + "/municipios?orderBy=nome").pipe(take(1));
  }

}


