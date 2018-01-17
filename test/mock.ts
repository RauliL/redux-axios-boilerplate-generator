import { Model, ModelConfig } from '../dist';

export interface Person extends Model {
  id: string;
  firstName: string;
  lastName: string;
}

export const PersonConfig: ModelConfig<Person> = {
  name: 'person',
  url: '/api/people/',
  convert: (data: { [propertyName: string]: any }) => ({
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName
  }),
}

export enum PersonAction {
  REQUEST = '@@person/request',
  REQUEST_SUCCESS = '@@person/request-success',
  REQUEST_ERROR = '@@person/request-error',
  REQUEST_LIST = '@@person/request-list',
  REQUEST_LIST_SUCCESS = '@@person/request-list-success',
  REQUEST_LIST_ERROR = '@@person/request-list-error',
}
