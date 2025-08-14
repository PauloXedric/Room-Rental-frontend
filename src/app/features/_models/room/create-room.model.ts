import { GenderRestrictionEnum, RoomTypeEnum } from "@shared/_enums";

export interface CreateRoomModel {
  roomName: string;
  description?: string;
  roomType: RoomTypeEnum;
  numberOfBeds: number;
  maxOccupants: number;
  genderRestriction: GenderRestrictionEnum;
  roomAddress?: string;
  monthlyPrice?: number;
  depositAmount?: number;
  inquireFromDate?: Date | null;
  inquireToDate?: Date | null;
  availableStartDate?: Date | null;
}