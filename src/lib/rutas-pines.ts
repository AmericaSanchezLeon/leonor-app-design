import cdmx1 from "@/assets/img/rutas-pines/pin_cdmx1.svg";
import cdmx2 from "@/assets/img/rutas-pines/pin_cdmx2.svg";
import cdmx3 from "@/assets/img/rutas-pines/pin_cdmx3.svg";
import cdmx4 from "@/assets/img/rutas-pines/pin_cdmx4.svg";
import cdmx5 from "@/assets/img/rutas-pines/pin_cdmx5.svg";
import cdmx6 from "@/assets/img/rutas-pines/pin_cdmx6.svg";
import cdmx7 from "@/assets/img/rutas-pines/pin_cdmx7.svg";
import cdmx8 from "@/assets/img/rutas-pines/pin_cdmx8.svg";
import slp1 from "@/assets/img/rutas-pines/pin_slp1.svg";
import slp2 from "@/assets/img/rutas-pines/pin_slp2.svg";
import slp3 from "@/assets/img/rutas-pines/pin_slp3.svg";
import slp4 from "@/assets/img/rutas-pines/pin_slp4.svg";
import c1 from "@/assets/img/rutas-pines/pin_c1.svg";
import c2 from "@/assets/img/rutas-pines/pin_c2.svg";
import c3 from "@/assets/img/rutas-pines/pin_c3.svg";
import c4 from "@/assets/img/rutas-pines/pin_c4.svg";

// One pin icon per "punto", in the same order they appear in rutasData.json.
export const rutasPinesByEstado: Record<string, string[]> = {
  "Ciudad de México": [cdmx1, cdmx2, cdmx3, cdmx4, cdmx5, cdmx6, cdmx7, cdmx8],
  "San Luis Potosí": [slp1, slp2, slp3, slp4],
  Chiapas: [c1, c2, c3, c4],
};
