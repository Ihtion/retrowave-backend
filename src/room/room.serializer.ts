import { Room } from './entities/room.entity';
import { UserIDType } from '../interfaces/common.interface';

export type SerializedRoom = {
  id: number;
  name: string;
  description: string | null;
  password: string | null;
  userID: UserIDType;
};

export class RoomSerializer {
  public static serialize(roomEntity: Room): SerializedRoom {
    return {
      id: roomEntity.id,
      name: roomEntity.name,
      description: roomEntity.description,
      password: roomEntity.password,
      userID: roomEntity.userId,
    };
  }

  public static serializeMany(roomEntities: Room[]): SerializedRoom[] {
    return roomEntities.map(this.serialize);
  }
}
