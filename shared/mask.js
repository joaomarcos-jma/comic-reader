import moment from "moment";
export default {
    dateFormat: (date) => {
        return moment(String(date)).format(`DD/MM/YYYY`)
    },
    dateFormatHh: (date) => {
        return moment(String(date)).format(`DD/MM/YYYY - HH:mm`)
    }
}