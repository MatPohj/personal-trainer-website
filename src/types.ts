export interface Training {
  date: string;
  duration: number;
  activity: string;
  customer?: Customer; 
  _links: {
    self: { href: string };
    training: { href: string };
    customer: { href: string };
  };
}

export interface EnrichedTraining extends Training {
  customerName?: string;
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

export function extractIdFromUrl(url: string): string {
  try {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  } catch (err) {
    console.error('Error extracting ID from URL:', err);
    return crypto.randomUUID();
  }
}
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}