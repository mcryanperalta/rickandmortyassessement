import { Controller } from "@hotwired/stimulus";
import api from "../util/api.js";

export default class extends Controller {
  static targets = ["loader","details","episodes"];
  static values = { character: Number }

  connect() {
    console.log('View controller connected');
    this.loading = this.application.getControllerForElementAndIdentifier(this.element, 'misc--loader');
    this.loading.show();

    this.loadCharacter(this.characterValue);
  }

  async loadCharacter(characterId) {
    this.loading.show();

    try {
      const response = await api.get(`/character/${characterId}`);
      console.log('details',response);
      this.renderCharacter(response.character,response.dimension);
      this.renderEpisodes(response.episodeIds);
    } catch (error) {
      this.detailsTarget.innerHTML = '<p class="text-red-500">Failed to load character.</p>';
      console.error(error);
    } finally {
      this.loading.hide();
    }
  }

  renderCharacter(character,dimension) {
    let locationLink = "";
    if(character.location.url == ""){
      locationLink = character.location.name;
    }else{
      const locationUrl =  this.renderSystemUrl(character.location.url,'location');
      locationLink = `<a href="${locationUrl}" class="text-blue-600 hover:text-blue-800" target="_blank"> ${character.location.name}</a>`
    }
    this.detailsTarget.innerHTML = `
        <div class="bg-white rounded-2xl shadow-lg p-8 flex items-center space-x-8 max-w-4xl mx-auto">
            <!-- Image -->
            <img src="${character.image}" alt="${character.name}" class="w-40 h-40 rounded-xl object-cover shadow-sm">

            <!-- Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 flex-1">
            <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight border-b-2 border-gray-300 pb-2 col-span-full">
              ${character.name}
            </h2>

            <p class="text-lg text-gray-600">
              Species: <span class="font-medium text-gray-800">${character.species}</span>
            </p>
            <p class="text-lg text-gray-600">
              Status: <span class="font-medium text-gray-800">${character.status}</span>
            </p>
            <p class="text-lg text-gray-600">
              Gender: <span class="font-medium text-gray-800">${character.gender}</span>
            </p>
            <p class="text-lg text-gray-600">
              Type: <span class="font-medium text-gray-800">${character.type || '--'}</span>
            </p>
            <p class="text-lg text-gray-600">
              Origin: <span class="font-medium text-gray-800">${character.origin.name}</span>
            </p>
            <p class="text-lg text-gray-600">
              Dimension: <span class="font-medium text-gray-800">${dimension}</span>
            </p>
            <p class="text-lg text-gray-600 col-span-full">
              Last Location Known:
              <span class="font-semibold">${locationLink}</span>
            </p>
          </div>
        </div>
        `;
    
  }

  async renderEpisodes(episodeIds = []) {
    const response = await api.post(`/episodes/get-by-ids`, { episodes: episodeIds });

    // Handle both single object or array in response
    const episodes = Array.isArray(response) ? response : [response];

    const cardsHtml = episodes.map(ep => {
        const epUrl = this.renderSystemUrl(ep.url,'episode');
        return `
       <div class="bg-white rounded-xl shadow-md p-6 w-full max-w-sm flex flex-col justify-between h-full">
        <div class="space-y-2">
            <h3 class="text-xl font-bold text-gray-800">
            <a href="${epUrl}">${ep.name}</a>
            </h3>
            <p class="text-gray-500">Air Date: <span class="text-gray-700 font-medium">${ep.air_date}</span></p>
            <p class="text-gray-500">Episode Code: <span class="text-gray-700 font-medium">${ep.episode}</span></p>
        </div>
        <div class="pt-4 mt-auto">
            <a href="${epUrl}" class="inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition">
            View
            </a>
        </div>
        </div>

    `
}).join('');

    this.loaderTarget.classList.add('hidden');
    this.episodesTarget.classList.remove('hidden');
    this.episodesTarget.innerHTML = `
        <h2 class="text-3xl">Episodes Partake</h2>
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
