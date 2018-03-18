# Frequently Asked Questions

## Resolvers

### Should I implement field resolver as a object type's getter, method or as a resolver class's method?
It really depends on various factors:
- if your resolver need access only to the root/object value - use a getter
- if your field has arguments
  - and need to perform side effects (like db call) - use resolver class's method (to leverage dependency injection mechanism)
  - otherwise - use object type's methods (pure function, calculate based on object value and arguments)
- if you want to separate business logic from type definition - use resolver class's method

## Bootstraping

### Should I use array of manually imported resolver classes or use a glob path string?
Using path to resolver module files force you to structure your's project folders or constantly name files with prefix/suffix. When you have several dozen of resolver classes, it might be easier than always remember about importing and registering each new class.
