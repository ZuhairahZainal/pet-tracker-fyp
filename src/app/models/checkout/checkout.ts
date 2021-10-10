export interface Address{
  addressId: string;
  userId: any;
  num: number;
  simpang: number;
  kampung: string;
  postCode: string;
  cityName: string;
  countryName: string;
}

export interface CardDetail{
  cardId: string,
  creditCardNumber: number,
  cvv: number,
  expiration: any,
  firstName: string,
  lastName: string,
  userId: string,
}
