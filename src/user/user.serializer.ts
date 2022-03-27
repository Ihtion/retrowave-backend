import { User } from './entities/user.entity';
import { Role } from '../roles/role.enum';

export type SerializedUser = {
  id: number;
  username: string;
  nickname: string | null;
  roles: Role[];
};

export class UserSerializer {
  public static serialize(userEntity: User): SerializedUser {
    return {
      id: userEntity.id,
      username: userEntity.username,
      nickname: userEntity.nickname,
      roles: userEntity.roles,
    };
  }

  public static serializeMany(userEntities: User[]): SerializedUser[] {
    return userEntities.map(this.serialize);
  }
}
