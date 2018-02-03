# Changelog and release notes

### Unreleased
#### Fixes
- fix missing type args in schema when declared in field resolver
- fix missing resolver function when defined as type field method

### 0.1.1
#### Features
- add support for ommiting return type when use type options, in selected decorators (`@Field`, `@Arg`)

#### Fixes
- fix class getter resolvers bug - missing fields from prototype (`plainToClass` bug)

### 0.1.0
#### Initial release