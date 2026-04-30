export interface IPlanet {
  name: string;
  sign: string;
  degree: number;
  house: number;
}

export interface IHouse {
  number: number;
  sign: string;
  degree: number;
}

export interface IBirthChart {
  planets: IPlanet[];
  houses: IHouse[];
  ascendant: string;
  moonSign: string;
}

export interface IKundali {
  _id: string;
  userId: string;
  birthChart: IBirthChart;
  createdAt: string;
  updatedAt: string;
}
