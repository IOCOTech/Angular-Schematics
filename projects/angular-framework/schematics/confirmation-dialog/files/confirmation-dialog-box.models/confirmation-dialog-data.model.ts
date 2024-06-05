import { MaterialIcons } from "../../enums/separated-enums/material-icons.enum";

export interface ModelDialogConfirmationData {
    header: string;
    message: string;
    displayCancelButton?: boolean,
    okButtonText?: string;
    icon?: MaterialIcons
    iconColor?: string
}
