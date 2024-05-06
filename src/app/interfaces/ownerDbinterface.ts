import { GoogleandFaceebookUserEntityType, UserEntityType } from "../../entites/user";
import { ownerDbRepositoryType } from "../../frameworks/database/repositories/ownerRepository";

export const ownerDbInterface = (
  repository: ReturnType<ownerDbRepositoryType>
) => {
  

  return{
  
  }
};

export type ownerDbInterfaceType=typeof ownerDbInterface
