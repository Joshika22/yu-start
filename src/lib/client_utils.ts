import { v4 as uuidv4 } from 'uuid';
export const generateRandomId = () : string => {
    return uuidv4();
};

export const formatDate = (date: Date | null): string => {
    if(!date) {
        return '';
    }
    const temp = new Date(date);
    const day = temp.getDate().toString().padStart(2, '0');
    const month = (temp.getMonth() + 1).toString().padStart(2, '0');
    const year = temp.getFullYear().toString();
    return `${day}/${month}/${year}`;
};