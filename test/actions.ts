import MockAdapter = require('axios-mock-adapter');
import axios from 'axios';
import createActions from '../src/actions';
import { Person, PersonConfig } from './mock';

describe('action creators', () => {
  const client = axios.create({});
  const mockAxios = new MockAdapter(client);

  beforeEach(() => {
    mockAxios.reset();
  });

  it('should create action for instance retrieval', () => {
    expect(createActions(PersonConfig, client).get).toBeDefined();
  });

  it('should create action for list retrieval', () => {
    expect(createActions(PersonConfig, client).list).toBeDefined();
  });
});
