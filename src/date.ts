import "reflect-metadata";

const CollectMetadata: PropertyDecorator = (target, propertyKey) => {
    const ReflectType = Reflect.getMetadata("design:type", target, propertyKey);
    console.log(ReflectType);
    console.log(ReflectType === Date);
}
class Test {
    @CollectMetadata
    property: Date;
}
