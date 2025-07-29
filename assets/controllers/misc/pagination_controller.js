import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = {
    total: Number,
    page: Number
  }

  connect() {
    console.log("Pagination controller connected");
    this.render();
  }

  totalValueChanged() {
    this.render();
  }

  pageValueChanged() {
    this.render();
  }

  render() {
    const total = this.totalValue || 1;
    const current = this.pageValue || 1;

    this.element.innerHTML = "";

    if (total <= 1) return;

    for (let i = 1; i <= total; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
    //   btn.setAttribute('data-action', 'click->misc--pagination#pageClicked');
    //   btn.setAttribute('data-page', i);

      btn.className = `mx-1 px-3 py-1 rounded ${i === current ? 'bg-blue-600 text-white' : 'bg-gray-200'}`;
      btn.addEventListener("click", () => {
        this.pageValue = i;
        console.log('button clicked',i)
       
        this.element.dispatchEvent(new CustomEvent("pageChange", {
            bubbles: true,
            detail: { page: i }
        }));
      });
      this.element.appendChild(btn);
    }
  }

  pageClicked(event) {
    console.log('triggered',event.target.attributes['data-page'].value);
    this.element.dispatchEvent(new CustomEvent("pageChange", {
        bubbles: true,
        detail: { page: event.target.attributes['data-page'].value }
    }));
  }
}
