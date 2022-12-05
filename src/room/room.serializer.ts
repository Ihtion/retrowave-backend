import { Room } from './entities/room.entity';
import { UserIDType } from '../interfaces/common.interface';

export type SerializedRoom = {
  id: number;
  name: string;
  description: string | null;
  password: string | null;
  userID: UserIDType;
  withPassword: boolean;
};

export class RoomSerializer {
  public static serialize(
    roomEntity: Room,
    userID: UserIDType,
  ): SerializedRoom {
    const password = roomEntity.userId === userID ? roomEntity.password : null;

    return {
      id: roomEntity.id,
      name: roomEntity.name,
      description: roomEntity.description,
      password: password,
      userID: roomEntity.userId,
      withPassword: Boolean(roomEntity.password),
    };
  }

  public static serializeMany(
    roomEntities: Room[],
    userID: UserIDType,
  ): SerializedRoom[] {
    return roomEntities.map((room) => this.serialize(room, userID));
  }
}
