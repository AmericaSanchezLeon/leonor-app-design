// Activity-tile icons. Each key maps to a normal/active asset pair.
import cocinaLibroN from "@/assets/img/room-icons/icono-cocina-libro.png.asset.json";
import cocinaTeteraN from "@/assets/img/room-icons/icono-cocina-tetera.png.asset.json";
import bibliotecaLibroN from "@/assets/img/room-icons/icono-biblioteca-libro.png.asset.json";
import bibliotecaMascaraN from "@/assets/img/room-icons/icono-biblioteca-mascara.png.asset.json";
import comedorAmigosN from "@/assets/img/room-icons/icono-comedor-amigos.png.asset.json";
import comedorRutasN from "@/assets/img/room-icons/icono-comedor-rutas.png.asset.json";
import proyectoLibroN from "@/assets/img/room-icons/icono-proyecto-libro.png.asset.json";
import proyectoAutoresN from "@/assets/img/room-icons/icono-proyecto-autores.png.asset.json";

import cocinaLibroA from "@/assets/img/room-icons-svg/icono-hover-cocina-libro.png.asset.json";
import cocinaTeteraA from "@/assets/img/room-icons-svg/icono-hover-cocina-tetera.png.asset.json";
import bibliotecaLibroA from "@/assets/img/room-icons-svg/icono-hover-biblioteca-libro.png.asset.json";
import bibliotecaMascaraA from "@/assets/img/room-icons-svg/icono-hover-biblioteca-mascara.png.asset.json";
import comedorAmigosA from "@/assets/img/room-icons-svg/icono-hover-comedor-amigos.png.asset.json";
import comedorRutasA from "@/assets/img/room-icons-hover/comedor-rutas.png";
import proyectoLibroA from "@/assets/img/room-icons-svg/icono-hover-proyecto-libro.png.asset.json";
import proyectoAutoresA from "@/assets/img/room-icons-svg/icono-hover-proyecto-autores.png.asset.json";

export type RoomIconKey =
  | "cocina-libro"
  | "cocina-tetera"
  | "biblioteca-libro"
  | "biblioteca-mascara"
  | "comedor-amigos"
  | "comedor-rutas"
  | "proyecto-libro"
  | "proyecto-autores";

export const roomIcons: Record<RoomIconKey, { normal: string; active: string }> = {
  "cocina-libro": { normal: cocinaLibroN.url, active: cocinaLibroA.url },
  "cocina-tetera": { normal: cocinaTeteraN.url, active: cocinaTeteraA.url },
  "biblioteca-libro": { normal: bibliotecaLibroN.url, active: bibliotecaLibroA.url },
  "biblioteca-mascara": { normal: bibliotecaMascaraN.url, active: bibliotecaMascaraA.url },
  "comedor-amigos": { normal: comedorAmigosN.url, active: comedorAmigosA.url },
  "comedor-rutas": { normal: comedorRutasN.url, active: comedorRutasA },
  "proyecto-libro": { normal: proyectoLibroN.url, active: proyectoLibroA.url },
  "proyecto-autores": { normal: proyectoAutoresN.url, active: proyectoAutoresA.url },
};
