export class RandomUtility {
    static int(length = 16) {
        return Number(new Array(length)
            .fill(null)
            .map(() => String(Math.floor(Math.min(Math.random() * 10, 9))))
            .join(''));
    }
    static string(length = 16, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
        let result = '';
        const { length: charsetLength } = charset;
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charsetLength));
        }
        return result;
    }
}
//# sourceMappingURL=random.utility.js.map