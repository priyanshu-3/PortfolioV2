/** Cards alternate sides; each 3D object sits on the opposite side so they never overlap. */
export const cardSide = (i: number) => (i % 2 === 0 ? "left" : "right");
