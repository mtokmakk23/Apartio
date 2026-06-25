export interface ApartmentViewModel {
  id?: string;
  name?: string;
  city?: string;
  town?: string;
  adress?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
  type?: string;
  isDelayCompensation?: boolean;
  delayCompensationRate?: number;
  lastPaymentDay?: number;
}
