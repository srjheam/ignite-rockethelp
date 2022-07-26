import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export function dateFormat(timestamp: FirebaseFirestoreTypes.Timestamp) {
    if (timestamp) {
        const date = new Date(timestamp.toDate());

        const dateString = date.toLocaleDateString('pt-BR');
        const timeString = date.toLocaleTimeString('pt-BR');

        return `${dateString} às ${timeString}`;
    }
}
