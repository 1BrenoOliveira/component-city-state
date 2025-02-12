import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { DxBoxModule, DxResponsiveBoxModule, DxSelectBoxModule, DxTemplateModule, DxTextBoxModule } from 'devextreme-angular';
import { CidadeEstadoService } from './cidade-estado.service';
import { HttpClientModule } from '@angular/common/http';
import { Estado } from './Estado';
import { ArrayStore } from 'devextreme/common/data';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Cidade } from './Cidade';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-cidade-estado',
  templateUrl: './cidade-estado.component.html',
  styleUrl: './style.scss'
})
export class CidadeEstadoComponent implements OnInit {
    @Input() estado: number = 0 ;
    @Input() cidade: number = 0 ;
    @Output() emissorCidadeEstado = new EventEmitter();

    dataEstados: ArrayStore;
    dataCidade: ArrayStore;


    constructor(private service: CidadeEstadoService){
    }

  ngOnInit(): void {
    this.carregarEstados();
    this.carregarCidades(this.estado);
  }

  screen(width) {
    return (width < 700) ? 'sm' : 'lg';
  }

  private carregarEstados(){
    this.service.listarEstado().subscribe(dados =>{
      this.dataEstados = new ArrayStore({
        data: dados,
        key: 'id'
      })
    })
  }

  private carregarCidades(value: number) {
    this.estado = value;
    this.service.pesquisarCidades(this.estado).subscribe(dados=>{
      this.dataCidade = new ArrayStore({
        data: dados,
        key: 'id'
      })
    })
  }

  private retornarCidadeEstado(){
    let nomeCidade, codUf ;
    this.dataCidade.byKey(this.cidade).then((dados)=> nomeCidade = dados.nome);
    this.dataEstados.byKey(this.estado).then((dados)=> codUf = dados.sigla);
    this.emissorCidadeEstado.emit({ 'cidade': nomeCidade, 'estado': codUf});
  }

  recarregarCidades({ value }: DxSelectBoxTypes.ValueChangedEvent) {
    this.carregarCidades(value);
  }

  informarCidade({ value }: DxSelectBoxTypes.ValueChangedEvent){
    this.cidade = value;
    this.retornarCidadeEstado();
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
