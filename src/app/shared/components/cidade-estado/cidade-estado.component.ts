import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { DxBoxModule, DxResponsiveBoxModule, DxSelectBoxModule, DxTemplateModule, DxTextBoxModule } from 'devextreme-angular';
import { CidadeEstadoService } from './cidade-estado.service';
import { HttpClientModule } from '@angular/common/http';
import { ArrayStore } from 'devextreme/common/data';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { FormsModule } from '@angular/forms';
import { delay } from 'rxjs';
import { Cidade } from './Cidade';
import { Estado } from './Estado';


@Component({
  selector: 'app-cidade-estado',
  templateUrl: './cidade-estado.component.html',
  styleUrl: './style.scss'
})
export class CidadeEstadoComponent implements OnInit {
    @Input() setEstado;
    @Input() setCidade;
    @Output() emissorCidadeEstado = new EventEmitter();

    estado: number = 0 ;
    cidade: number = 0 ;
    dataEstados: ArrayStore;
    dataCidade: ArrayStore;


    constructor(private service: CidadeEstadoService){
    }

  ngOnInit(): void {
    this.carregarEstados();
    this.carregarCidades();
  }

  screen(width) {
    return (width < 700) ? 'sm' : 'lg';
  }

  private carregarEstados(){
    this.service.listarEstado().subscribe(dados =>{
      this.dataEstados = new ArrayStore({
        data: dados,
        key: 'id'
      });
      this.verificarTipoInputEstado(dados);
    })
  }

  carregarCidades() {
    this.service.pesquisarCidades(this.estado).subscribe(dados=>{
      this.dataCidade = new ArrayStore({
        data: dados,
        key: 'id'
      });
      this.verificarTipoInputCidade(dados);
    })
  }

  retornarCidadeEstado(){
    if(this.dataCidade){
      this.emissorCidadeEstado.emit({
          'cidade': this.retornaItemDeArrayStore(this.cidade, this.dataCidade),
          'estado': this.retornaItemDeArrayStore(this.estado, this.dataEstados)
        });
    }
  }

  private retornaItemDeArrayStore(key, arrayStore: ArrayStore){
    let item;
    arrayStore.byKey(key).then((dados)=> item = dados);
    return item;
  }

  private verificarTipoInputEstado(lista){
    if(this.setEstado){
      let tipo = typeof(this.setEstado);
      if(tipo == 'number') this.estado = this.setEstado;
      else if(tipo == 'string' || this.setEstado.length == 2 ) this.converterSiglaEmIdEstado(lista, this.setEstado);
      else if(tipo=='object'){
        if(this.setEstado.id) this.estado = this.setEstado?.id
        else if(this.setEstado.sigla ) this.converterSiglaEmIdEstado(lista, this.setEstado.sigla);
      }
    }
  }

  private verificarTipoInputCidade(lista){
    if(this.setCidade){
      let tipo = typeof(this.setCidade);
      if(tipo == 'number') this.cidade = this.setCidade;
      else if(tipo=='object'){
        if(this.setCidade.id) this.cidade = this.setCidade?.id
      }
    }
  }

  private converterSiglaEmIdEstado(lista, valor){
    lista.forEach(item => {
      (item.sigla == valor.toUpperCase()) ? this.estado = item.id : 0;
    });
  }

}



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DxResponsiveBoxModule,
    HttpClientModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxBoxModule,
    DxTemplateModule
  ],
  declarations: [ CidadeEstadoComponent ],
  exports: [ CidadeEstadoComponent ]
})
export class CidadeEstadoModule { }
