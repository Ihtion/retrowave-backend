import { Room } from './entities/room.entity';

export type SerializedRoom = {
  id: number;
  name: string;
  description: string | null;
  password: string | null;
};

export class RoomSerializer {
  public static serialize(roomEntity: Room): SerializedRoom {
    return {
      id: roomEntity.id,
      name: roomEntity.name,
      description: roomEntity.description,
      password: roomEntity.password,
    };
  }

  public static serializeMany(roomEntities: Room[]): SerializedRoom[] {
    return roomEntities.map(this.serialize);
  }
}
