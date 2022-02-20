import { User } from './entities/user.entity';

export type SerializedUser = {
  id: number;
  username: string;
  nickname: string | null;
};

export class UserSerializer {
  public static serialize(userEntity: User): SerializedUser {
    return {
      id: userEntity.id,
      username: userEntity.username,
      nickname: userEntity.nickname,
    };
  }

  public static serializeMany(userEntities: User[]): SerializedUser[] {
    return userEntities.map(this.serialize);
  }
}
