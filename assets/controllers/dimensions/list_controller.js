import { Controller } from "@hotwired/stimulus";
import api from "../util/api.js";

export default class extends Controller {
  static targets = ["loader","list","input","characters"];
  static values = { page: Number }

  connect() {
    console.log('List controller connected');
    this.loading = this.application.getControllerForElementAndIdentifier(this.element, 'misc--loader');

    if (this.hasInputTarget) {
        this.loadDimensions(this.inputTarget.value);
        this.loading.show();
    } else {
      console.error("Input target not found");
    }
   
  }

  submit(){
    window.location.href=`?search=${this.inputTarget.value}`
  }

  async loadDimensions(query) {
    if (query !== "") {
        this.loading.show();

        try {
            const response = await api.get(`/dimensions?search=${query}`);
            this.renderLocationCards(response.locations.results);
            this.renderCharacters(response.characterIds);
        } catch (error) {
            this.listTarget.innerHTML = '<p class="text-red-500">Failed to load characters.</p>';
            console.error(error);
        } finally {
            this.loading.hide();
        }
    } else{
        this.loading.hide();
    }
  }


  renderLocationCards(locations) {
    this.listTarget.innerHTML = '';

    locations.forEach(location => {
      const card = this.createCard(location);
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
