import { AnyAction } from 'redux';

import Model, { ModelConfig, ModelState, ModelStateInstanceMapping } from './model';

type ActionCallback<T extends Model> = (state: ModelState<T>, action: AnyAction) => ModelState<T>;

const createInitialState = <T extends Model>(): ModelState<T> => ({
  isFetching: false,
  isUnableToFetch: false,
  lastFetched: undefined,
  mapping: {},
});

export default function createReducer<T extends Model>(config: ModelConfig<T>) {
  const actionCallbacks: { [key: string]: ActionCallback<T> } = {
    [`@@${config.name}/request`]: (state: ModelState<T>, action: AnyAction): ModelState<T> => ({
      ...state,
      mapping: {
        [action.id]: {
          isFetching: true,
          isUnableToFetch: false,
        }
      }
    }),

    [`@@${config.name}/request-error`]: (state: ModelState<T>, action: AnyAction): ModelState<T> => ({
      ...state,
      mapping: {
        [action.id]: {
          isFetching: false,
          isUnableToFetch: true,
          lastFetched: Date.now(),
        }
      }
    }),

    [`@@${config.name}/request-success`]: (state: ModelState<T>, action: AnyAction): ModelState<T> => {
      try {
        const instance = config.convert(action.data);

        return {
          ...state,
          mapping: {
            ...state.mapping,
            [action.id]: {
              isFetching: false,
              isUnableToFetch: false,
              lastFetched: Date.now(),
              instance,
            }
          }
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
            }
          }
        };
      }
    },

    [`@@${config.name}/request-list`]: (state: ModelState<T>, action: AnyAction): ModelState<T> => ({
      ...state,
      isFetching: true,
      isUnableToFetch: false,
    }),

    [`@@${config.name}/request-list-error`]: (state: ModelState<T>, action: AnyAction): ModelState<T> => ({
      ...state,
      isFetching: false,
      isUnableToFetch: true,
      lastFetched: Date.now(),
    }),

    [`@@${config.name}/request-list-success`]: (state: ModelState<T>, action: AnyAction): ModelState<T> => ({
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
              isFetching: false,
              isUnableToFetch: false,
              lastFetched: Date.now(),
              instance
            };
          } catch (e) {
            // TODO: Log this exception to state somehow.
          }

          return result;
        },
        {}
      ),
    }),
  };

  return (state: ModelState<T> = createInitialState<T>(), action: AnyAction): ModelState<T> => {
    const callback: ActionCallback<T> = actionCallbacks[action.type];

    if (callback) {
      return callback(state, action);
    } else {
      return state;
    }
  };
}
