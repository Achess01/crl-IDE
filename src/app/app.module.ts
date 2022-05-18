import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextEditorComponent } from './text-editor/text-editor.component';

import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EditorManagerComponent } from './editor-manager/editor-manager.component';
import { TabHeaderComponent } from './tab-header/tab-header.component';
import { EditorDirective } from './editor-manager/editor.directive';
import { TabDirective } from './editor-manager/tab.directive';
import { HttpClientModule } from '@angular/common/http';
import { ResultDirective } from './editor-manager/result.directive';
import { ResultImgComponent } from './editor-manager/result.component';
import { TableResultComponent } from './editor-manager/tableResult.component';

@NgModule({
  declarations: [
    AppComponent,
    TextEditorComponent,
    EditorManagerComponent,
    TabHeaderComponent,
    EditorDirective,
    TabDirective,
    ResultDirective,
    ResultImgComponent,
    TableResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CodemirrorModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
