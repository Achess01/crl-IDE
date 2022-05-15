import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorManagerComponent } from './editor-manager/editor-manager.component';

const routes: Routes = [    
    {path: '', component: EditorManagerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
