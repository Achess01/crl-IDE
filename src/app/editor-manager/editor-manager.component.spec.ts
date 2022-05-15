import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorManagerComponent } from './editor-manager.component';

describe('EditorManagerComponent', () => {
  let component: EditorManagerComponent;
  let fixture: ComponentFixture<EditorManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
