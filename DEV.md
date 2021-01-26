# Use string literals for boolean properties
To avoid confusion of default value

### Don't:
```typescript
export type FooField = {
  type: 'foo',
  isUnique: boolean,
}
```
### Do:
```typescript
export type FooField = {
  type: 'foo',
  properties: ArrayOr<'isUnique'>
}
```
