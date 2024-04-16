export interface IMotor {
  model: string;
  reqNumber: string;
  value: number;
  yearOfManufacture: number;
  use: string;
}

export interface INonMotor {
  address: string;
  city: string;
  purpose: string;
  products: string;
}
