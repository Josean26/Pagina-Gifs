import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root' // Angular lo eleve a nivel global
})
export class GifsService {
  
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';    
  private apiKey : string = 'J8wrfy78rzeZxm5zKE8tNPloELOwsA1Q';

  public resultados: Gif[] = [];
  private _historial: string[]= [];


  get historial(){
    return  [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial=JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados=JSON.parse(localStorage.getItem('resultados')!) || [];
  }


  buscarGifs(query: string = ''){

    query=query.trim().toLocaleLowerCase();

    if(!this._historial.includes(query) || query===''){
      this._historial.unshift(query);
      this._historial=this._historial.splice(0,10);
    }

    localStorage.setItem('historial',JSON.stringify(this.historial));
      
    //Realizamos la peticion HTTP
    const params = new HttpParams()
      .set('api_key',this.apiKey)
      .set('q',query)
      .set('limit','10');


    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
    .subscribe((resp) => {
      
      this.resultados = resp.data;
      localStorage.setItem('resultados',JSON.stringify(this.resultados));
      console.log(this.resultados);
    })
  }

}
