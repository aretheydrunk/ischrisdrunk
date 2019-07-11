import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatDatepickerModule, MatFormFieldModule, MatCardModule, MatNativeDateModule, MatInputModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        AppRoutingModule,
        MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        BrowserModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
