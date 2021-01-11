import english from './languages/english';
export default (() => {
    switch (globalThis?.navigator?.language?.substr(0, 2)) {
        case 'cn':
            return null;
        case 'en':
        default:
            return english;
    }
})();
//# sourceMappingURL=strings.js.map