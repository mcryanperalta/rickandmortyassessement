import { Controller } from "@hotwired/stimulus";
import api from "./util/api.js";

export default class extends Controller {
  static targets = ["title"];

  load() {
    this.loadLists();
  }

  async loadLists() {
    try {
      const posts = await api.get('/list-all');
      this.titleTarget.value = posts.map(post => `<p>${post.title}</p>`).join('');
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }
}
