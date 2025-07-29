import { Controller } from "@hotwired/stimulus";
import api from "../util/api.js";

export default class extends Controller {
  static targets = ["loader","details","characters"];
  static values = { location: Number }

  connect() {
    console.log('View controller connected');
    this.loading = this.application.getControllerForElementAndIdentifier(this.element, 'misc--loader');
    this.loading.show();

    this.loadCharacter(this.locationValue);
  }

  async loadCharacter(locationId) {
    this.loading.show();

    try {
      const response = await api.get(`/location/${locationId}`);
      console.log('details',response);
      this.renderLocation(response.location);
      this.renderCharacters(response.characterIds);
    } catch (error) {
      this.detailsTarget.innerHTML = '<p class="text-red-500">Failed to load character.</p>';
      console.error(error);
    } finally {
      this.loading.hide();
    }
  }

  renderLocation(location) {
    // const locationUrl = this.renderSystemUrl(character.location.url,'location');
    this.detailsTarget.innerHTML = `
          <div class="bg-white rounded-xl shadow-md p-6 w-full  flex flex-col justify-between h-full">
            <div class="space-y-2">
                <h3 class="text-3xl font-bold text-gray-800">
                    ${location.name}
                </h3>
                <p class="text-gray-500">Dimension: <span class="text-gray-700 font-medium"><a class="text-blue-600 hover:text-blue-800" href="/rick-and-morty/dimensions?search=${location.dimension}">${location.dimension}</a></span></p>
                <p class="text-gray-500">Type: <span class="text-gray-700 font-medium">${location.type}</span></p>
            </div>
        </div>
        `;
    
  }

  async renderCharacters(characterIds = []) {
    const response = await api.post(`/characters/get-by-ids`, { characters: characterIds });

    // Handle both single object or array in response
    const characters = Array.isArray(response) ? response : [response];

    const cardsHtml = characters.map(ch => {
        const chUrl = this.renderSystemUrl(ch.url,'profile');
        return `
            <div class="flex-shrink-0 h-full">
                <a href="${chUrl}" title="${ch.name}">
                    <img class="h-full w-auto object-cover" src="${ch.image}" alt="${ch.name}">
                </a>
            </div>

                `
}).join('');

    this.loaderTarget.classList.add('hidden');
    this.charactersTarget.classList.remove('hidden');
    this.charactersTarget.innerHTML = `
        <h2 class="text-3xl">Residents</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            ${cardsHtml}
        </div>
    `;
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
