export type TPublicUser = {
  name: {
    bengaliName: string;
    englishName: string;
  };
  image: {
    url: string;
  };
  designation: string;
  dateOfBirth: string;
  contact: {
    email: string;
    mobile?: string;
    whatsapp?: string;
  };
  address?: {
    address: string;
    district: string;
  };
  bloodGroup: string;
  qualification: string;
};
