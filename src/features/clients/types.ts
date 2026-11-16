import type {
  ID,
  RiskProfile,
  EntityStatus,
} from "@/types/common";

export interface Client {
  id: ID;
  clientCode: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  dateOfBirth: string;
  occupation: string;

  riskProfile: RiskProfile;
  status: EntityStatus;

  assignedManagerId: ID;

  createdAt: string;
  updatedAt: string;
}
