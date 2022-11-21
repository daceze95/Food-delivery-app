// DTO = data transfer object
import { vendorPayload } from "./vendor.dto";
import { userPayload } from "./user.dto";

export type AuthPayload = vendorPayload | userPayload
