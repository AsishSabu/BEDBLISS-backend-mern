export default function userEntity(
  name: string,
  email: string,
  phoneNumber: string,
  password: string
){
    return{
    // getFirstName:():string=>firstName,
    getName:():string=>name,
    getEmail:():string=>email,
    getPhoneNumber:():string=>phoneNumber,
    getPassword:():string=>password
}
}

export type UserEntityType=ReturnType<typeof userEntity>

export function GoogleandFaceebookSignInUserEntity(
  name:string,
  email:string,
  picture:string,
  email_verified:boolean
){
  return{
    name:():string=>name,
    email:():string=>email,
    picture:():string=>picture,
    email_verified:():boolean=>email_verified
  };
}
export type GoogleandFaceebookUserEntityType=ReturnType<typeof GoogleandFaceebookSignInUserEntity>;