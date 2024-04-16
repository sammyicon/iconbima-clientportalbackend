export interface IMotor {
  model: string;
  reqNumber: string;
  startDate: string;
  endDate: string;
  yearOfManufacture: number;
  use: string;
}

export interface INonMotor {
  address: string;
  city: string;
  purpose: string;
  products: string;
}
