export interface CreateUserInterface {
  name: string;
  email: string;
  phone:string;
  password: string;
  role:string;
}
export interface UserInterface {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  phone: string;
  role: string;
  wallet?: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt?: Date;
}
