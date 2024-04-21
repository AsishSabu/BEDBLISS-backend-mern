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
    getPhoneNumber:():number=>parseInt(phoneNumber),
    getPassword:():string=>password
}
}

export type UserEntityType=ReturnType<typeof userEntity>