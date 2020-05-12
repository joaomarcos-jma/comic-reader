export default {
    trimString: (string, length) => {
        if (string) {
            return string.length > length ?
                string.substring(0, length) + '...' :
                string;
        }
    }
}