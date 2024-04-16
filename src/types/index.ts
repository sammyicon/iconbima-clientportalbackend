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

export interface IQuote {
  user: any;
  model: string;
  reqNumber: number;
  use: string;
  yearOfManufacture: number;
  premium: number;
  stamp_duty: number;
  trainning_levy: number;
  PHCfund: number;
}

export interface IUser {
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  password: string;
}
