import MockAdapter = require('axios-mock-adapter');
import axios from 'axios';
import createActions from '../src/actions';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Person, PersonAction, PersonConfig } from './mock';

describe('action creators', () => {
  const client = axios.create({});
  const mockAxios = new MockAdapter(client);
  const mockStore = createMockStore([thunk]);
  const actions = createActions(PersonConfig, client);

  beforeEach(() => {
    mockAxios.reset();
  });

  it('should create action for instance retrieval', () => {
    expect(actions.get).toBeDefined();
  });

  it('should create action for list retrieval', () => {
    expect(actions.list).toBeDefined();
  });

  it('should handle successful instance retrieval', () => {
    const store = mockStore();

    mockAxios.onGet('/api/people/Test/').reply(200, {
      id: 'Test',
      firstName: 'Test',
      lastName: 'Test',
    });

    return store.dispatch(actions.get('Test')).then(() => {
      expect(store.getActions()).toEqual([
        {
          type: PersonAction.REQUEST,
          id: 'Test',
        },
        {
          type: PersonAction.REQUEST_SUCCESS,
          id: 'Test',
          data: {
            id: 'Test',
            firstName: 'Test',
            lastName: 'Test',
          },
        },
      ]);
    });
  });

  it('should handle erroneous instance retrieval', () => {
    const store = mockStore();

    mockAxios.onGet('/api/people/Test/').reply(404);

    return store.dispatch(actions.get('Test')).then(() => {
      const actions = store.getActions();

      expect(actions.find(action => action.type === PersonAction.REQUEST)).toBeDefined();
      expect(actions.find(action => action.type === PersonAction.REQUEST_ERROR)).toBeDefined();
    });
  });

  it('should handle successful list retrieval', () => {
    const store = mockStore();

    mockAxios.onGet('/api/people/').reply(200, [
      {
        id: 'Test1',
        firstName: 'Test',
        lastName: 'Test',
      },
      {
        id: 'Test2',
        firstName: 'Test',
        lastName: 'Test',
      },
    ]);

    return store.dispatch(actions.list()).then(() => {
      expect(store.getActions()).toEqual([
        {
          type: PersonAction.REQUEST_LIST,
        },
        {
          type: PersonAction.REQUEST_LIST_SUCCESS,
          data: [
            {
              id: 'Test1',
              firstName: 'Test',
              lastName: 'Test',
            },
            {
              id: 'Test2',
              firstName: 'Test',
              lastName: 'Test',
            },
          ],
        },
      ]);
    });
  });

  it('should handle erroneous list retrieval', () => {
    const store = mockStore();

    mockAxios.onGet('/api/people/').reply(403);

    return store.dispatch(actions.list()).then(() => {
      const actions = store.getActions();

      expect(actions.find(action => action.type === PersonAction.REQUEST_LIST)).toBeDefined();
      expect(actions.find(action => action.type === PersonAction.REQUEST_LIST_ERROR)).toBeDefined();
    });
  });
});
