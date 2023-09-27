import { registerInDevtools, Store } from "pullstate";

export interface RegisterStep1 {
  username: string;
  password: string;
}

export interface RegisterStep2 {
  nric: string;
}

export interface RegisterStep3 {
  firstName: string;
  lastName: string;
  sex: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  race: string;
  address: string;
  contactNumber: string;
}

export type FormValues = RegisterStep1 & RegisterStep2 & RegisterStep3;

export const WizardStore = new Store<FormValues>({
  username: "",
  password: "",
  nric: "",
  firstName: "",
  lastName: "",
  sex: "",
  dateOfBirth: "",
  placeOfBirth: "",
  nationality: "",
  race: "",
  address: "",
  contactNumber: "",
});

registerInDevtools({
  WizardStore,
});
