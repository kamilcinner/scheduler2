import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor() { }

  // Smooth scrolls up the page.
  onActivate(event) {
    this.hideTopNav()
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

  // Called when mouse leaves top nav.
  onMouseLeave() {
    this.hideTopNav()
  }

  /**
   * Hides top nav if it is not collapsed.
   */
  hideTopNav(): void {
    const toggler = document.getElementById('navbar-toggler-button')
    if (!toggler.classList.contains('collapsed')) {
      toggler.click()
    }
  }

}
