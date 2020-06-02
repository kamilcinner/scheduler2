import { Router } from '@angular/router'

/**
 * Provide redirect with proper console warn.
 */
export class PageNotFound {

  public static redirect(router: Router): void {
    router.navigate(['/404']).then(() => console.warn('Page not found!'))
  }
}
