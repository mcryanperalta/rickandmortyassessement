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
      const response = await api.get(`/characters/all?page=${page}`);
      this.renderCharacterCards(response.results);
      this.renderPagination(response.info.pages, page);
    } catch (error) {
      this.listTarget.innerHTML = '<p class="text-red-500">Failed to load characters.</p>';
      console.error(error);
    } finally {
      this.loading.hide();
    }
  }

  renderCharacterCards(characters) {
    this.listTarget.innerHTML = '';

    characters.forEach(character => {
      const card = this.createCard(character);
      if (card) this.listTarget.appendChild(card);
    });
  }

  createCard(character) {
    const profileUrl = this.renderSystemUrl(character.url,'profile');
    const locationUrl = this.renderSystemUrl(character.location.url,'location');
    const card = document.createElement('div');
    let locationLink = "";
    if(character.location.url == ""){
      locationLink = character.location.name;
    }else{
      const locationUrl =  this.renderSystemUrl(character.location.url,'location');
      locationLink = `<a href="${locationUrl}" class="text-blue-600 hover:text-blue-800" target="_blank"> ${character.location.name}</a>`
    }
    card.className = 'flex items-center bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow';

    card.innerHTML = `
      <div class="flex h-full">
        <div class="flex-shrink-0 h-full">
          <img class="h-full w-auto object-cover" src="${character.image}" alt="${character.name}">
        </div>
        <div class="p-4 flex flex-col">
          <div class="font-bold text-xl"><a class="text-blue-600 hover:text-blue-800" href="${profileUrl}">${character.name}</a></div>
          <p class="text-gray-500">${character.species} - ${character.status}</p>
          <p class="text-gray-500">Gender: ${character.gender}</p>
          <p class="text-gray-500">Origin: ${character.origin.name}</p>
          <p class="text-gray-500">Last Location :${locationLink}</p>
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
          data-action="click->characters--list#pageClicked"
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
