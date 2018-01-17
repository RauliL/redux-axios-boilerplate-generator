import createReducer from '../src/reducer';
import { Person, PersonAction, PersonConfig } from './mock';

describe('reducer creator', () => {
  const reducer = createReducer<Person>(PersonConfig);

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'test' })).toEqual({
      isFetching: false,
      isUnableToFetch: false,
      lastFetched: undefined,
      mapping: {},
    });
  });

  it('should respond to instance retrieval request', () => {
    const state = reducer(undefined, {
      type: PersonAction.REQUEST,
      id: 'Test'
    });

    expect(state).toBeDefined();
    expect(state.mapping).toBeDefined();
    expect(state.mapping.Test).toBeDefined();
    expect(state.mapping.Test.isFetching).toBe(true);
    expect(state.mapping.Test.isUnableToFetch).toBe(false);
    expect(state.mapping.Test.lastFetched).toBeUndefined();
    expect(state.mapping.Test.instance).toBeUndefined();
  });

  it('should respond to erroneous instance retrieval response', () => {
    const state = reducer(undefined, {
      type: PersonAction.REQUEST_ERROR,
      id: 'Test'
    });

    expect(state).toBeDefined();
    expect(state.mapping).toBeDefined();
    expect(state.mapping.Test).toBeDefined();
    expect(state.mapping.Test.isFetching).toBe(false);
    expect(state.mapping.Test.isUnableToFetch).toBe(true);
    expect(typeof state.mapping.Test.lastFetched).toBe('number');
    expect(state.mapping.Test.instance).toBeUndefined();
  });

  it('should respond to successful instance retriaval response', () => {
    const state = reducer(undefined, {
      type: PersonAction.REQUEST_SUCCESS,
      id: 'Test',
      data: {
        id: 'Test',
        firstName: 'Test',
        lastName: 'Test',
      },
    });

    expect(state).toBeDefined();
    expect(state.mapping).toBeDefined();
    expect(state.mapping.Test).toBeDefined();
    expect(state.mapping.Test.isFetching).toBe(false);
    expect(state.mapping.Test.isUnableToFetch).toBe(false);
    expect(typeof state.mapping.Test.lastFetched).toBe('number');
    expect(state.mapping.Test.instance).toEqual({
      id: 'Test',
      firstName: 'Test',
      lastName: 'Test',
    });
  });

  it('shouldn\'t touch existing entries in the state', () => {
    const initialState = {
      isFetching: false,
      isUnableToFetch: false,
      mapping: {
        Test1: {
          isFetching: false,
          isUnableToFetch: false,
          lastFetched: 1,
          instance: {
            id: 'Test1',
            firstName: 'Test',
            lastName: 'Test',
          },
        },
      },
    };

    expect(reducer(
      initialState,
      {
        type: PersonAction.REQUEST_SUCCESS,
        id: 'Test2',
        data: {
          id: 'Test2',
          firstName: 'Test',
          lastName: 'Test',
        },
      },
    ).mapping.Test1).toBeDefined();

    expect(reducer(
      initialState,
      {
        type: PersonAction.REQUEST_ERROR,
        id: 'Test2',
      },
    ).mapping.Test1).toBeDefined();
  });

  it('should respond to list retrieval request', () => {
    const state = reducer(undefined, { type: PersonAction.REQUEST_LIST });

    expect(state).toBeDefined();
    expect(state.isFetching).toBe(true);
    expect(state.isUnableToFetch).toBe(false);
    expect(state.lastFetched).toBeUndefined();
  });

  it('should respond to erroneous list retrieval response', () => {
    const state = reducer(undefined, { type: PersonAction.REQUEST_LIST_ERROR });

    expect(state).toBeDefined();
    expect(state.isFetching).toBe(false);
    expect(state.isUnableToFetch).toBe(true);
    expect(typeof state.lastFetched).toBe('number');
  });

  it('should respond to successful list retrieval response', () => {
    const state = reducer(undefined, {
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
      ]
    });

    expect(state).toBeDefined();
    expect(state.isFetching).toBe(false);
    expect(state.isUnableToFetch).toBe(false);
    expect(typeof state.lastFetched).toBe('number');

    expect(state.mapping).toBeDefined();
    [1, 2].forEach(index => {
      const id = `Test${index}`;

      expect(state.mapping[id]).toBeDefined();
      expect(state.mapping[id].isFetching).toBe(false);
      expect(state.mapping[id].isUnableToFetch).toBe(false);
      expect(typeof state.mapping[id].lastFetched).toBe('number');
      expect(state.mapping[id].instance).toEqual({
        id,
        firstName: 'Test',
        lastName: 'Test',
      });
    });
  });
});
