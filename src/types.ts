export interface Training {
    date: string;
    duration: number;
    activity: string;
    _links: {
      self: { href: string };
      training: { href: string };
      customer: { href: string };
    };
  }
  
export interface TrainingResponse {
  _embedded: {
    trainings: Training[];
  };
}

export interface Customer {
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
  _links: {
    self: { href: string };
    customer: { href: string };
    trainings: { href: string };
  };
}

export interface CustomerResponse {
  _embedded: {
    customers: Customer[];
  };
}