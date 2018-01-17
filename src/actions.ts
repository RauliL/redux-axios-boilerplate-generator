import * as urljoin from 'url-join';
import { AnyAction, Dispatch } from 'redux';
import { AxiosInstance } from 'axios';

import Model, { ModelConfig } from './model';

export default function createActions<T extends Model>(config: ModelConfig<T>, client: AxiosInstance) {
  const get = (id: string) => (dispatch: Dispatch<AnyAction>) => {
    dispatch({
      type: `@@${config.name}/request`,
      id
    });

    return client.get(urljoin(config.url, id, '/')).then(
      response => dispatch({
        type: `@@${config.name}/request-success`,
        id,
        data: response.data
      }),
      error => dispatch({
        type: `@@${config.name}/request-error`,
        id,
        error
      })
    );
  };
  const list = () => (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: `@@${config.name}/request-list` });

    return client.get(config.url).then(
      response => dispatch({
        type: `@@${config.name}/request-list-success`,
        data: response.data
      }),
      error => dispatch({
        type: `@@${config.name}/request-list-error`,
        error
      })
    );
  };

  return { get, list };
}
