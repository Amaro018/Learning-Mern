export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === undefined) {
        throw Error(`Expected 'value' to be defined, but received ${value}`);
    }
}