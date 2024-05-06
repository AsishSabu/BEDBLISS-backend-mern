export default function userEntity(
  name: string,
  email: string,
  phone: string,
  password: string,
  role:string
){
    return{
    // getFirstName:():string=>firstName,
    getName:():string=>name,
    getEmail:():string=>email,
    getPhoneNumber:():string=>phone,
    getPassword:():string=>password,
    getUserRole:():string=>role
}
}

export type UserEntityType=ReturnType<typeof userEntity>

export function GoogleandFaceebookSignInUserEntity(
  name:string,
  email:string,
  picture:string,
  email_verified:boolean,
  role:string
){
  return{
    name:():string=>name,
    email:():string=>email,
    picture:():string=>picture,
    email_verified:():boolean=>email_verified,
    getUserRole:():string=>role
  };
}
export type GoogleandFaceebookUserEntityType=ReturnType<typeof GoogleandFaceebookSignInUserEntity>;