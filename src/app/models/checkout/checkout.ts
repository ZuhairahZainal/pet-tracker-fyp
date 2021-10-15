export interface Address{
  addressId: string;
  userId: any;
  num: number;
  addressNo: number;
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
  amount: number,
  donationId: string,
  date: string,
}

