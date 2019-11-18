import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { APIService } from 'app/api.service'


@Injectable()
export class AdminGuard implements CanActivate {
  public authToken;
  private isAuthenticated = false; // Set this value dynamically
  private userInfo: any
  private urlData: any
  private userUrlType: any
  
  constructor(private router: Router, private route: ActivatedRoute, private auth: APIService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      console.log(this.auth.isLoggedIn())
      if(!this.auth.isLoggedIn()){
        this.router.navigate(['/', 'login']);
        return false;
      }
    return true;
  }
}