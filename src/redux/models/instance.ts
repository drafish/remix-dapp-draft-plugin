// @ts-expect-error
import SurgeClient from '../../utils/surge-client';
import { type ModelType } from '../store';
import { execution } from '@remix-project/remix-lib';
import template from '../../template.html?raw';

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
    abi: [],
    defaultAbi: [],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    init(state, { payload }) {
      const functionHashes: any = {};
      for (const fun in payload.methodIdentifiers) {
        functionHashes[payload.methodIdentifiers[fun]] = fun;
      }
      const abi = payload.abi.filter((item: any) => {
        if (item.type === 'function') {
          item.id = encodeFunctionId(item);
          const method = functionHashes[item.id.replace('0x', '')];
          item.intro = payload.devdoc.methods[method].details;
          return true;
        } else {
          return false;
        }
      });
      return { ...state, ...payload, abi, defaultAbi: abi };
    },
    reset(state, _) {
      return { ...state, abi: state.defaultAbi };
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

      // const {data} = yield axios.get('https://remix-dapp.surge.sh/manifest.json')
      // const {file, css, assets} = data['index.html']
      // const paths = [file, ...css, ...assets]

      const { defaultAbi, ...instance } = yield select(
        (state) => state.instance
      );

      const files: Record<string, string> = {
        'dir/instance.json': JSON.stringify(instance),
        'dir/defaultAbi.json': JSON.stringify(defaultAbi),
        'dir/index.html': template,
      };

      // for (let index = 0; index < paths.length; index++) {
      //   const path = paths[index]
      //   // const resp = yield axios.get(`https://remix-dapp.surge.sh/${path}`)
      //   // files[`dir/${path}`] = resp.data
      //   files['dir/index.html'] = files['dir/index.html'].replace(`/${path}`, `https://remix-dapp.surge.sh/${path}`)
      // }

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
