import { Controller } from "@hotwired/stimulus";
import api from "../util/api.js";

export default class extends Controller {
  static targets = ["loader","list","pagination"];
  static values = { page: Number }

  connect() {
    console.log('List controller connected');
    this.loading = this.application.getControllerForElementAndIdentifier(this.element, 'misc--loader');
    this.loading.show();

    this.pageValue = this.pageValue || 1;
    this.loadLists(this.pageValue);
  }

  async loadLists(page = 1) {
    this.pageValue = page;
    this.loading.show();

    try {
      const response = await api.get(`/locations/all?page=${page}`);
      this.renderLocationCards(response.results);
      this.renderPagination(response.info.pages, page);
    } catch (error) {
      this.listTarget.innerHTML = '<p class="text-red-500">Failed to load characters.</p>';
      console.error(error);
    } finally {
      this.loading.hide();
    }
  }

  renderLocationCards(episodes) {
    this.listTarget.innerHTML = '';

    episodes.forEach(episode => {
      const card = this.createCard(episode);
      if (card) this.listTarget.appendChild(card);
    });
  }

  createCard(location) {
    const locationUrl = this.renderSystemUrl(location.url,'location');
    const card = document.createElement('div');
    card.className = 'flex items-center bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow';

    card.innerHTML = `
       <div class="bg-white rounded-xl shadow-md p-6 w-full max-w-sm flex flex-col justify-between h-full">
            <div class="space-y-2">
                <h3 class="text-xl font-bold text-gray-800">
                <a href="${locationUrl}">${location.name}</a>
                </h3>
                <p class="text-gray-500">Dimension: <span class="text-gray-700 font-medium">${location.dimension}</span></p>
                <p class="text-gray-500">Type: <span class="text-gray-700 font-medium">${location.type}</span></p>
            </div>
            <div class="pt-4 mt-auto">
                <a href="${locationUrl}" class="inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                View
                </a>
            </div>
        </div>

    `;

    return card;
  }

  renderSystemUrl(url,type = 'profile'){
    const id = url.split('/').pop();
    let parsedUrl = '';
    switch (type) {
      case 'profile':
          parsedUrl = '/rick-and-morty/character/'; 
        break;
    
      case 'location':
         parsedUrl = '/rick-and-morty/location/'; 
        break;
    
      case 'episode':
         parsedUrl = '/rick-and-morty/episode/'; 
        break;
    
      default:
        break;
    }

    return parsedUrl+id;
  }

  renderPagination(totalPages, currentPage = 1) {
    let buttonsHtml = "";

    for (let i = 1; i <= totalPages; i++) {
      buttonsHtml += `
        <button 
          class="mx-1 px-3 py-1 mb-2 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}"
          data-action="click->locations--list#pageClicked"
          data-page="${i}">
          ${i}
        </button>
      `;
    }

    this.paginationTarget.innerHTML = buttonsHtml;
  }


  pageClicked(event) {
    const page = parseInt(event.target.dataset.page);
    this.pageValue = page;
    this.loadLists(page);
  }

}
