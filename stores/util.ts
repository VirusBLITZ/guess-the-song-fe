export const swapRemove = <T>(arr: T[], index: number) => {
    const last = arr.pop();
    if (last && index !== arr.length) {
        arr[index] = last;
    }
}
