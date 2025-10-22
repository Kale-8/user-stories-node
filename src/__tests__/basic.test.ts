describe('Basic Math Operations', () => {
  it('should add two numbers correctly', () => {
    expect(2 + 2).toBe(4);
  });

  it('should multiply two numbers correctly', () => {
    expect(3 * 4).toBe(12);
  });

  it('should handle string operations', () => {
    const str = 'Hello World';
    expect(str.length).toBe(11);
    expect(str.toUpperCase()).toBe('HELLO WORLD');
  });

  it('should handle array operations', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr.length).toBe(5);
    expect(arr.includes(3)).toBe(true);
    expect(arr.filter(n => n > 3)).toEqual([4, 5]);
  });

  it('should handle object operations', () => {
    const obj = { name: 'Test', value: 42 };
    expect(obj.name).toBe('Test');
    expect(obj.value).toBe(42);
    expect(Object.keys(obj)).toEqual(['name', 'value']);
  });
});
