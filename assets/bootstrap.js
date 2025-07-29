import { Application } from "@hotwired/stimulus";
import HelloController from "./controllers/hello_controller.js";
import CharacterListController from "./controllers/characters/list_controller.js";
import CharacterViewController from "./controllers/characters/view_controller.js";
import EpisodeListController from "./controllers/episodes/list_controller.js";
import EpisodeViewController from "./controllers/episodes/view_controller.js";
import LocationListController from "./controllers/locations/list_controller.js";
import LocationViewController from "./controllers/locations/view_controller.js";
import LoaderController from "./controllers/misc/loader_controller.js";
import PaginationController from "./controllers/misc/pagination_controller.js";
import DimensionListController from "./controllers/dimensions/list_controller.js";

const app = Application.start();
app.debug = true;

app.register("hello", HelloController);
app.register("characters--list", CharacterListController);
app.register("characters--view", CharacterViewController);
app.register("episodes--list", EpisodeListController);
app.register("episodes--view", EpisodeViewController);
app.register("locations--list", LocationListController);
app.register("locations--view", LocationViewController);
app.register("dimensions--list", DimensionListController);
app.register("misc--loader", LoaderController);
app.register("misc--pagination", PaginationController);
