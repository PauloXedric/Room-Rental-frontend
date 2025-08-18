import {
  ReadRoomModel,
  PatchRoomInfoModel,
  PatchRoomPricingModel,
} from '@features/_models';
import { GenderRestrictionEnum, RoomTypeEnum } from '@shared/_enums';

export function mapRoomToPatchInfo(room: ReadRoomModel): PatchRoomInfoModel {
  return {
    roomId: room.roomId,
    roomName: room.roomName,
    description: room.description,
    roomType: room.roomType ?? RoomTypeEnum.None,
    numberOfBeds: room.numberOfBeds ?? 0,
    maxOccupants: room.maxOccupants ?? 0,
    genderRestriction: room.genderRestriction ?? GenderRestrictionEnum.None,
    roomAddress: room.roomAddress,
  };
}

export function mapRoomToPatchPricing(
  room: ReadRoomModel
): PatchRoomPricingModel {
  return {
    roomId: room.roomId,
    monthlyPrice: room.monthlyPrice ?? 0,
    depositAmount: room.depositAmount ?? 0,
  };
}
