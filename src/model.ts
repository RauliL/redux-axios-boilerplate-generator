export default interface Model {
  id: string;
  [propertyName: string]: any;
}

export interface ModelConfig<T extends Model> {
  name: string;
  url: string;
  convert: (data: { [propertyName: string]: any }) => T;
}

export interface ModelStateInstanceMapping<T extends Model> {
  isFetching: boolean;
  isUnableToFetch: boolean;
  lastFetched?: number;
  instance?: T;
}

export interface ModelState<T extends Model> {
  isFetching: boolean;
  isUnableToFetch: boolean;
  lastFetched?: number;
  mapping: {
    [id: string]: ModelStateInstanceMapping<T>;
  }
}
