import { RoomTypeEnum, GenderRestrictionEnum } from '@shared/_enums';

export interface ReadRoomModel {
  roomId: number;
  roomName: string;
  description?: string;
  roomType?: RoomTypeEnum | null;
  numberOfBeds?: number;
  maxOccupants?: number;
  currentOccupantsCount?: number;
  isAvailable?: boolean;
  genderRestriction?: GenderRestrictionEnum | null;
  roomAddress?: string;
  monthlyPrice?: number;
  depositAmount?: number;
}
