import axios from 'axios';
// @ts-expect-error
import SurgeClient from '../../utils/surge-client';
import { type ModelType } from '../store';
import { execution } from '@remix-project/remix-lib';

const { encodeFunctionId } = execution.txHelper;

const surgeClient = new SurgeClient({
  proxy: 'https://vercel-proxy-bice-six.vercel.app',
  onError: (err: Error) => {
    console.log(err);
  },
});

const Model: ModelType = {
  namespace: 'instance',
  state: {
    name: '',
    address: '',
    network: '',
    abi: {},
    items: {},
    containers: [],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    init(state, { payload: { methodIdentifiers, devdoc, ...payload } }) {
      const functionHashes: any = {};
      for (const fun in methodIdentifiers) {
        functionHashes[methodIdentifiers[fun]] = fun;
      }
      const abi: any = {};
      payload.abi.forEach((item: any) => {
        if (item.type === 'function') {
          item.id = encodeFunctionId(item);
          const method = functionHashes[item.id.replace('0x', '')];
          item.intro = devdoc.methods[method]
            ? devdoc.methods[method].details
            : '';
          abi[item.id] = item;
        }
      });
      const ids = Object.keys(abi);
      const items =
        ids.length > 1
          ? {
              A: ids.slice(0, ids.length / 2 + 1),
              B: ids.slice(ids.length / 2 + 1),
            }
          : { A: ids };
      return {
        ...state,
        ...payload,
        abi,
        items,
        containers: Object.keys(items),
      };
    },
    reset(state, _) {
      const ids = Object.keys(state.abi);
      const items =
        ids.length > 1
          ? {
              A: ids.slice(0, ids.length / 2 + 1),
              B: ids.slice(ids.length / 2 + 1),
            }
          : { A: ids };
      return { ...state, items, containers: Object.keys(items) };
    },
    empty(state, _) {
      return { ...state, abi: [], defaultAbi: [] };
    },
  },
  effects: {
    *saveIntro({ payload }, { select, put }) {
      const abi = yield select((state) => state.instance.abi);

      yield put({
        type: 'instance/save',
        payload: {
          abi: abi.map((item: any) => {
            return {
              ...item,
              intro: item.id === payload.id ? payload.intro : item.intro,
            };
          }),
        },
      });
    },
    *saveTitle({ payload }, { select, put }) {
      const abi = yield select((state) => state.instance.abi);

      yield put({
        type: 'instance/save',
        payload: {
          abi: abi.map((item: any) => {
            return {
              ...item,
              title: item.id === payload.id ? payload.title : item.title,
            };
          }),
        },
      });
    },
    *deploy({ payload }, { select }) {
      const surgeToken = localStorage.getItem('__SURGE_TOKEN');
      let isLogin = false;
      if (surgeToken) {
        try {
          yield surgeClient.whoami();
          isLogin = true;
        } catch (error) {
          /* empty */
        }
      }
      if (!isLogin) {
        try {
          yield surgeClient.login({
            user: payload.email,
            password: payload.password,
          });
          localStorage.setItem('__SURGE_EMAIL', payload.email);
          localStorage.setItem('__SURGE_PASSWORD', payload.password);
        } catch (error: any) {
          return { code: 'ERROR', error: error.message };
        }
      }

      const { data } = yield axios.get(
        'https://remix-dapp.pages.dev/manifest.json'
      );
      const { src, file, css, assets } = data['index.html'];
      const paths = [src, file, ...css, ...assets];

      const instance = yield select((state) => state.instance);

      const files: Record<string, string> = {
        'dir/instance.json': JSON.stringify({
          ...instance,
          shareTo: payload.shareTo,
        }),
      };

      console.log(
        JSON.stringify({
          ...instance,
          shareTo: payload.shareTo,
        })
      );

      for (let index = 0; index < paths.length; index++) {
        const path = paths[index];
        const resp = yield axios.get(`https://remix-dapp.pages.dev/${path}`);
        files[`dir/${path}`] = resp.data;
      }

      try {
        yield surgeClient.publish({
          files,
          domain: `${payload.subdomain}.surge.sh`,
          onProgress: ({
            id,
            progress,
            file,
          }: {
            id: string;
            progress: number;
            file: string;
          }) => {
            console.log({ id, progress, file });
          },
          onTick: (tick: string) => {},
        });
      } catch (error) {
        return { code: 'ERROR', error: 'this domain belongs to someone else' };
      }

      return { code: 'SUCCESS', error: '' };
    },
  },
};

export default Model;
