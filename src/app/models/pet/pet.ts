export interface Pet {
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
