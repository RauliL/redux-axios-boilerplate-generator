import { AnyAction } from "redux";

import Model, { ModelConfig, ModelState, ModelStateInstanceMapping } from "./model";

const createInitialState = <T extends Model>(): ModelState<T> => ({
  isFetching: false,
  isUnableToFetch: false,
  lastFetched: undefined,
  mapping: {},
});

export default function createReducer<T extends Model>(config: ModelConfig<T>) {
  const onRequest = (state: ModelState<T>, action: AnyAction): ModelState<T> => ({
    ...state,
    mapping: {
      ...state.mapping,
      [action.id]: {
        isFetching: true,
        isUnableToFetch: false,
      },
    },
  });

  const onRequestError = (state: ModelState<T>, action: AnyAction): ModelState<T> => ({
    ...state,
    mapping: {
      ...state.mapping,
      [action.id]: {
        isFetching: false,
        isUnableToFetch: true,
        lastFetched: Date.now(),
      },
    },
  });

  const onRequestSuccess = (state: ModelState<T>, action: AnyAction): ModelState<T> => {
    try {
      const instance = config.convert(action.data);

      return {
        ...state,
        mapping: {
          ...state.mapping,
          [action.id]: {
            instance,
            isFetching: false,
            isUnableToFetch: false,
            lastFetched: Date.now(),
          },
        },
      };
    } catch (e) {
      return {
        ...state,
        mapping: {
          ...state.mapping,
          [action.id]: {
            isFetching: false,
            isUnableToFetch: true,
            lastFetched: Date.now(),
          },
        },
      };
    }
  };

  const onRequestList = (state: ModelState<T>, action: AnyAction): ModelState<T> => ({
    ...state,
    isFetching: true,
    isUnableToFetch: false,
  });

  const onRequestListError = (state: ModelState<T>, action: AnyAction): ModelState<T> => ({
    ...state,
    isFetching: false,
    isUnableToFetch: true,
    lastFetched: Date.now(),
  });

  const onRequestListSuccess = (state: ModelState<T>, action: AnyAction): ModelState<T> => ({
    ...state,
    isFetching: false,
    isUnableToFetch: false,
    lastFetched: Date.now(),
    mapping: action.data.reduce(
      (result: { [id: string]: ModelStateInstanceMapping<T> },
       data: { [propertyName: string]: any }): { [id: string]: ModelStateInstanceMapping<T> } => {
        try {
          const instance = config.convert(data);

          result[instance.id] = {
            instance,
            isFetching: false,
            isUnableToFetch: false,
            lastFetched: Date.now(),
          };
        } catch (e) {
          // TODO: Log this exception to state somehow.
        }

        return result;
      },
      {},
    ),
  });

  const actionCallbacks = {
    [`@@${config.name}/request`]: onRequest,
    [`@@${config.name}/request-error`]: onRequestError,
    [`@@${config.name}/request-success`]: onRequestSuccess,
    [`@@${config.name}/request-list`]: onRequestList,
    [`@@${config.name}/request-list-error`]: onRequestListError,
    [`@@${config.name}/request-list-success`]: onRequestListSuccess,
  };

  return (state: ModelState<T> = createInitialState<T>(), action: AnyAction): ModelState<T> => {
    const callback = actionCallbacks[action.type];

    if (callback) {
      return callback(state, action);
    } else {
      return state;
    }
  };
}
