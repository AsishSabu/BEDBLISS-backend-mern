export interface CreateUserInterface {
  name: string;
  email: string;
  password: string;
  role:string
}
export interface UserInterface {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePic?: string;
  role: string;
  wallet?: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  verificationCode?: string;
}
