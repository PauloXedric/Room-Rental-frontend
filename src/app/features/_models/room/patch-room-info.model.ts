import { GenderRestrictionEnum, RoomTypeEnum } from '@shared/_enums';

export interface PatchRoomInfoModel {
  roomId: number;
  roomName: string;
  description?: string;
  roomType: RoomTypeEnum;
  numberOfBeds: number;
  maxOccupants: number;
  genderRestriction: GenderRestrictionEnum;
  roomAddress?: string;
}
