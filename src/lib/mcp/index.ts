import { defineMcp } from "@lovable.dev/mcp-js";
import listRooms from "./tools/list-rooms";
import listBooks from "./tools/list-books";
import listRecipes from "./tools/list-recipes";
import listFriends from "./tools/list-friends";
import listRoutes from "./tools/list-routes";
import getAbout from "./tools/get-about";

export default defineMcp({
  name: "leonorapp-mcp",
  title: "Leonorapp — Casa Estudio Leonora Carrington",
  version: "0.1.0",
  instructions:
    "Read-only tools exposing the content of the Casa Estudio Leonora Carrington interactive app: rooms, library books, recipes, friends, map routes, and about/authors.",
  tools: [listRooms, listBooks, listRecipes, listFriends, listRoutes, getAbout],
});
