import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarControlService {

  // (o==================================================================o)
  //   #region INITIALIZATION
  // (o-----------------------------------------------------------\/-----o)
  
  constructor() {}
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion INITIALIZATION
  // (o==================================================================o)

  // (o==================================================================o)
  //   #region VARIABLES
  // (o-----------------------------------------------------------\/-----o)
  
  private _inner_component_template?: TemplateRef<any>
  private _inner_title_template?: TemplateRef<any>

  get inner_component_template(): TemplateRef<any> | undefined {
    return this._inner_component_template
  }

  set inner_component_template(value: TemplateRef<any>) {
    this._inner_component_template = value
  }

  get inner_title_template(): TemplateRef<any> | undefined {
    return this._inner_title_template
  }

  set inner_title_template(value: TemplateRef<any>) {
    this._inner_title_template = value
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion VARIABLES
  // (o==================================================================o)
  
  
  
}
