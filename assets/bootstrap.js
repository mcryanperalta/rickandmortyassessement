import { Application } from "@hotwired/stimulus";
import HelloController from "./controllers/hello_controller.js";
import ListController from "./controllers/list_controller.js";

const app = Application.start();

app.register("hello", HelloController);
app.register("list", ListController);
