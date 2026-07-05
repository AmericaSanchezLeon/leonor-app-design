import type { SectionBgId } from "./room-backgrounds";

import a1 from "@/assets/img/room-bg-scatter/about/bg_about-01.svg.asset.json";
import a2 from "@/assets/img/room-bg-scatter/about/bg_about-02.svg.asset.json";
import a3 from "@/assets/img/room-bg-scatter/about/bg_about-03.svg.asset.json";
import a4 from "@/assets/img/room-bg-scatter/about/bg_about-04.svg.asset.json";
import a5 from "@/assets/img/room-bg-scatter/about/bg_about-05.svg.asset.json";

import b1 from "@/assets/img/room-bg-scatter/biblioteca/bg_biblioteca-01.svg.asset.json";
import b2 from "@/assets/img/room-bg-scatter/biblioteca/bg_biblioteca-02.svg.asset.json";
import b3 from "@/assets/img/room-bg-scatter/biblioteca/bg_biblioteca-03.svg.asset.json";
import b4 from "@/assets/img/room-bg-scatter/biblioteca/bg_biblioteca-04.svg.asset.json";

import c1 from "@/assets/img/room-bg-scatter/cocina/bg_cocina-01.svg.asset.json";
import c2 from "@/assets/img/room-bg-scatter/cocina/bg_cocina-02.svg.asset.json";
import c3 from "@/assets/img/room-bg-scatter/cocina/bg_cocina-03.svg.asset.json";
import c4 from "@/assets/img/room-bg-scatter/cocina/bg_cocina-04.svg.asset.json";
import c5 from "@/assets/img/room-bg-scatter/cocina/bg_cocina-05.svg.asset.json";

import d1 from "@/assets/img/room-bg-scatter/comedor/bg_comedor-01.svg.asset.json";
import d2 from "@/assets/img/room-bg-scatter/comedor/bg_comedor-02.svg.asset.json";
import d3 from "@/assets/img/room-bg-scatter/comedor/bg_comedor-03.svg.asset.json";
import d4 from "@/assets/img/room-bg-scatter/comedor/bg_comedor-04.svg.asset.json";
import d5 from "@/assets/img/room-bg-scatter/comedor/bg_comedor-05.svg.asset.json";

import h1 from "@/assets/img/room-bg-scatter/home/bg_home-01.svg.asset.json";
import h2 from "@/assets/img/room-bg-scatter/home/bg_home-02.svg.asset.json";
import h3 from "@/assets/img/room-bg-scatter/home/bg_home-03.svg.asset.json";
import h4 from "@/assets/img/room-bg-scatter/home/bg_home-04.svg.asset.json";
import h5 from "@/assets/img/room-bg-scatter/home/bg_home-05.svg.asset.json";
import h6 from "@/assets/img/room-bg-scatter/home/bg_home-06.svg.asset.json";

export const roomScatterAssets: Record<SectionBgId, string[]> = {
  about: [a1.url, a2.url, a3.url, a4.url, a5.url],
  biblioteca: [b1.url, b2.url, b3.url, b4.url],
  cocina: [c1.url, c2.url, c3.url, c4.url, c5.url],
  comedor: [d1.url, d2.url, d3.url, d4.url, d5.url],
  home: [h1.url, h2.url, h3.url, h4.url, h5.url, h6.url],
};
