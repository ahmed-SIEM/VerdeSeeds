import { Component, ViewEncapsulation, OnInit , OnDestroy } from '@angular/core';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutsComponent implements OnInit, OnDestroy {

  ngOnInit() {

    this.loadScripts([
      '../../../assets/backoffice/plugins/popper.min.js',
      '../../../assets/backoffice/js/app.js',
      "../../../assets/backoffice/plugins/bootstrap/js/bootstrap.min.js",

    ]);


  }
  ngOnDestroy() {
    this.removeScripts([
      '../../../assets/backoffice/plugins/popper.min.js',
      '../../../assets/backoffice/js/app.js',
      "../../../assets/backoffice/plugins/bootstrap/js/bootstrap.min.js",
    ]);
  }




  private loadScripts(scripts: string[]) {
    scripts.forEach((script) => {
      const scriptTag = document.createElement('script');
      scriptTag.src = script;
      scriptTag.async = true;
      document.body.appendChild(scriptTag);
    });
  }



  private removeScripts(scripts: string[]) {
    scripts.forEach((script) => {
      const scriptElements = document.body.getElementsByTagName('script');
      for (let i = 0; i < scriptElements.length; i++) {
        if (scriptElements[i].src === script) {
          document.body.removeChild(scriptElements[i]);
        }
      }
    });
  }

}
