export interface RoleDto {
  items: Item[];
}
export interface Item {
    extraProperties: ExtraProperties;
    id: string;
    name: string;
    isDefault: boolean;
    isStatic: boolean;
    isPublic: boolean;
    concurrencyStamp: string;
  }
  interface ExtraProperties {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  }