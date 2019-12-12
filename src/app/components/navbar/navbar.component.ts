import { Component, OnInit, ElementRef } from '@angular/core'
import { ROUTES } from '../sidebar/sidebar.component'
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common'
import { Router } from '@angular/router'
import { APIService } from 'app/api.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[]
    location: Location
      mobile_menu_visible: any = 0
    private toggleButton: any
    private sidebarVisible: boolean

    constructor(location: Location,  private element: ElementRef, private router: Router, private api:APIService) {
      this.location = location
          this.sidebarVisible = false
    }

    ngOnInit() {
      this.listTitles = ROUTES.filter(listTitle => listTitle)
      const navbar: HTMLElement = this.element.nativeElement
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0]
      this.router.events.subscribe((event) => {
         var $layer: any = document.getElementsByClassName('close-layer')[0]
         if ($layer) {
           $layer.remove()
           this.mobile_menu_visible = 0
         }
     })
    }

    getTitle() {
      var titlee = this.location.prepareExternalUrl(this.location.path())
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 )
      }

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title
          }
      }
      return 'Implants View'
    }

    logout(){
      this.api.logout();
    }
}
