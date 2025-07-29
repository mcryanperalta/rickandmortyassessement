
import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['content', 'indicator']

  show() {
    this.indicatorTarget.classList.remove('hidden')
    this.contentTarget.classList.add('hidden')
  }

  hide() {
    this.indicatorTarget.classList.add('hidden')
    this.contentTarget.classList.remove('hidden')
  }
}