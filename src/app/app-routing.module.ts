import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { AppComponent } from './app.component';

const routes: Routes = [
    {path: '', component: AppComponent},
    {path: 'editor', component: TextEditorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
