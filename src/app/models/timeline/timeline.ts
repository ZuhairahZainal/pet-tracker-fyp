export interface Feed {
  adminApprove: string,
  category: string,
  createdAt: string,
  userId: string,
  feedFormId: string,
  feedImage: string,
  feedStatus: string,
}

export interface Donation {
  adminApprove: string,
  category: string,
  createdAt: string,
  userId: string,
  description: string,
  location: string,
  lostPetFormId: string,
  petcolor: string,
  petgender: string,
  petname: string,
  reward: boolean,
  rewardAmount: number,
  petImage: string,
}

export interface LostPet {
  adminApprove: string,
  category: string,
  createdAt: string,
  userId: string,
  donationFormId: string,
  title: string,
  donationType: string,
  donationAmount: number,
  description: string,
  receiptImage: string,
}
