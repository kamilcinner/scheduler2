import { Component } from '@angular/core'
import { TopNavComponent } from '@app/base/top-nav';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor() { }

  onActivate(event) {
    AppComponent.hideTopNav()
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset
      if (pos > 0) {
        // How far to scroll on each step.
        window.scrollTo(0, pos - 20)
      } else {
        window.clearInterval(scrollToTop)
      }
    }, 16)
  }

  /**
   * Hides top nav if it is not collapsed.
   */
  static hideTopNav(): void {
    const toggler = document.getElementById('navbar-toggler-button')
    if (!toggler.classList.contains('collapsed')) {
      toggler.click()
    }
  }

  onMouseLeave() {
    AppComponent.hideTopNav()
  }

}
