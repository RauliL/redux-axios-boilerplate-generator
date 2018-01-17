import * as urljoin from "url-join";

import { AxiosInstance } from "axios";
import { AnyAction, Dispatch } from "redux";

import Model, { ModelConfig } from "./model";

export default function createActions<T extends Model>(config: ModelConfig<T>, client: AxiosInstance) {
  const get = (id: string) => (dispatch: Dispatch<AnyAction>) => {
    dispatch({
      id,
      type: `@@${config.name}/request`,
    });

    return client.get(urljoin(config.url, id, "/")).then(
      (response) => dispatch({
        data: response.data,
        id,
        type: `@@${config.name}/request-success`,
      }),
      (error) => dispatch({
        error,
        id,
        type: `@@${config.name}/request-error`,
      }),
    );
  };
  const list = () => (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: `@@${config.name}/request-list` });

    return client.get(config.url).then(
      (response) => dispatch({
        data: response.data,
        type: `@@${config.name}/request-list-success`,
      }),
      (error) => dispatch({
        error,
        type: `@@${config.name}/request-list-error`,
      }),
    );
  };

  return { get, list };
}
