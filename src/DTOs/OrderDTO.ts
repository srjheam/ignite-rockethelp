import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { OrderStatus } from "../types";

export interface OrderDTO {
    patrimony: string,
    description: string,
    status: OrderStatus,
    solution?: string,
    created_at: FirebaseFirestoreTypes.Timestamp,
    closed_at?: FirebaseFirestoreTypes.Timestamp
}
