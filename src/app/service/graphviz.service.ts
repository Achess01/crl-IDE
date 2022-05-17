import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphvizService {
  private url: string = 'https://quickchart.io/graphviz?graph';

  constructor(private http: HttpClient) { }

  getImage(dot: string) {
    let body = {
      graph: dot      
    }
    return this.http.post(this.url,body ,{ responseType: 'blob' });
  }
}
