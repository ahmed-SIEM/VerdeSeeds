import { Component, ViewEncapsulation, OnInit , OnDestroy } from "@angular/core";

@Component({
  selector: "app-layouts",
  templateUrl: "./layouts.component.html",
  styleUrls: ["./layouts.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutsComponent implements OnInit, OnDestroy {



  ngOnInit() {

    this.loadScripts([
      "../../../assets/frontoffice/js/jquery.min.js",
      "../../../assets/frontoffice/js/popper.min.js",
      "../../../assets/frontoffice/js/bootstrap.min.js",

      "../../../assets/frontoffice/js/owl.carousel.min.js",
      "../../../assets/frontoffice/js/classynav.js",
      "../../../assets/frontoffice/js/wow.min.js",

      "../../../assets/frontoffice/js/jquery.sticky.js",
      "../../../assets/frontoffice/js/jquery.magnific-popup.min.js",
      "../../../assets/frontoffice/js/jquery.scrollup.min.js",

      "../../../assets/frontoffice/js/jarallax.min.js",
      "../../../assets/frontoffice/js/jarallax-video.min.js",
      "../../../assets/frontoffice/js/active.js",

    ]);


  }
  ngOnDestroy() {
    this.removeScripts([
      "../../../assets/frontoffice/js/jquery.min.js",
      "../../../assets/frontoffice/js/popper.min.js",
      "../../../assets/frontoffice/js/bootstrap.min.js",

      "../../../assets/frontoffice/js/owl.carousel.min.js",
      "../../../assets/frontoffice/js/classynav.js",
      "../../../assets/frontoffice/js/wow.min.js",

      "../../../assets/frontoffice/js/jquery.sticky.js",
      "../../../assets/frontoffice/js/jquery.magnific-popup.min.js",
      "../../../assets/frontoffice/js/jquery.scrollup.min.js",

      "../../../assets/frontoffice/js/jarallax.min.js",
      "../../../assets/frontoffice/js/jarallax-video.min.js",
      "../../../assets/frontoffice/js/js/active.js",
      
    ]);
  }





  private loadScripts(scripts: string[]) {
    scripts.forEach((script) => {
      const scriptTag = document.createElement("script");
      scriptTag.src = script;
      scriptTag.async = true;
      document.body.appendChild(scriptTag);
    });
  }



  private removeScripts(scripts: string[]) {
    scripts.forEach((script) => {
      const scriptElements = document.body.getElementsByTagName("script");
      for (let i = 0; i < scriptElements.length; i++) {
        if (scriptElements[i].src === script) {
          document.body.removeChild(scriptElements[i]);
        }
      }
    });
  }

}
