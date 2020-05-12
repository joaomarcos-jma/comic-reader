export default {
    trimString: (string, length) => {
        if (string) {
            return string.length > length ?
                string.substring(0, length) + '...' :
                string;
        }
    },
    arrayState: (arr, current) => ({
        current,
        arr,
        next() {
            if (this.current >= (this.arr.length - 1)) {
                this.current = this.arr.length - 1;
            } else {
                this.current++;
            }
            return {
                obj: this.arr[this.current],
                index: this.current
            };
        },
        prev() {
            if (this.current <= 0) {
                this.current = 0;
            } else {
                this.current--;
            }
            return {
                obj: this.arr[this.current],
                index: this.current
            };
        }
    }),
    releaseTransform: (obj) => {
        return Object.entries(obj).find(res => res)[1];
    }
}