export interface Pet {
  time: number,
  date: string,
  userImage: string,
  userName: string,
  petName: string,
  petBreed: string,
  petCategory: string,
  petCondition: string,
  petGender: string,
  petBirthdate: string,
  petImage: string,
  petId: string,
}

export interface Device {
  time: number,
  date: string,
  deviceId: string;
  deviceName: string;
  deviceDescription: string;
  userId: string;
}

export interface updatedDevice{
  deviceName: string;
  deviceDescription: string;
}
