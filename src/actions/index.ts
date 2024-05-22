import axios from 'axios';
import { execution } from '@remix-project/remix-lib';
// @ts-expect-error
import SurgeClient from '../utils/surge-client';
import remixClient from '../remix-client';

const { encodeFunctionId } = execution.txHelper;

const surgeClient = new SurgeClient({
  proxy: 'https://vercel-proxy-bice-six.vercel.app',
  onError: (err: Error) => {
    console.log(err);
  },
});

let dispatch: any, state: any;

export const initDispatch = (_dispatch: any) => {
  dispatch = _dispatch;
};

export const updateState = (_state: any) => {
  state = _state;
};

export const connectRemix = async () => {
  await dispatch({
    type: 'SET_LOADING',
    payload: {
      screen: true,
    },
  });

  await remixClient.onload();

  await dispatch({
    type: 'SET_LOADING',
    payload: {
      screen: false,
    },
  });
};

export const saveIntro = async (payload: any) => {
  const { abi } = state.instance;

  await dispatch({
    type: 'SET_INSTANCE',
    payload: {
      abi: {
        ...abi,
        [payload.id]: { ...abi[payload.id], intro: payload.intro },
      },
    },
  });
};

export const saveTitle = async (payload: any) => {
  const { abi } = state.instance;

  await dispatch({
    type: 'SET_INSTANCE',
    payload: {
      abi: {
        ...abi,
        [payload.id]: { ...abi[payload.id], title: payload.title },
      },
    },
  });
};

export const deploy = async (payload: any, callback: any) => {
  const surgeToken = localStorage.getItem('__SURGE_TOKEN');
  const surgeEmail = localStorage.getItem('__SURGE_EMAIL');
  let isLogin = false;
  if (surgeToken && surgeEmail === payload.email) {
    try {
      await surgeClient.whoami();
      isLogin = true;
    } catch (error) {
      /* empty */
    }
  }
  if (!isLogin) {
    try {
      await surgeClient.login({
        user: payload.email,
        password: payload.password,
      });
      localStorage.setItem('__SURGE_EMAIL', payload.email);
      localStorage.setItem('__SURGE_PASSWORD', payload.password);
      localStorage.setItem('__DISQUS_SHORTNAME', payload.shortname);
    } catch (error: any) {
      callback({ code: 'ERROR', error: error.message });
      return;
    }
  }

  const { data } = await axios.get(
    'https://remix-dapp.pages.dev/manifest.json'
  );
  const { src, file, css, assets } = data['index.html'];
  const paths = [src, file, ...css, ...assets];

  const instance = state.instance;

  const files: Record<string, string> = {
    'dir/instance.json': JSON.stringify({
      ...instance,
      shortname: payload.shortname,
      shareTo: payload.shareTo,
    }),
  };

  // console.log(
  //   JSON.stringify({
  //     ...instance,
  //     shareTo: payload.shareTo,
  //   })
  // );

  for (let index = 0; index < paths.length; index++) {
    const path = paths[index];
    const resp = await axios.get(`https://remix-dapp.pages.dev/${path}`);
    files[`dir/${path}`] = resp.data;
  }

  try {
    await surgeClient.publish({
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
        // console.log({ id, progress, file });
      },
      onTick: (tick: string) => {},
    });
  } catch (error) {
    callback({ code: 'ERROR', error: 'this domain belongs to someone else' });
    return;
  }

  callback({ code: 'SUCCESS', error: '' });
  return;
};

export const initInstance = async ({
  methodIdentifiers,
  devdoc,
  ...payload
}: any) => {
  const functionHashes: any = {};
  for (const fun in methodIdentifiers) {
    functionHashes[methodIdentifiers[fun]] = fun;
  }
  const abi: any = {};
  payload.abi.forEach((item: any) => {
    if (item.type === 'function') {
      item.id = encodeFunctionId(item);
      const method = functionHashes[item.id.replace('0x', '')];
      item.intro =
        devdoc && devdoc.methods[method] ? devdoc.methods[method].details : '';
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
  await dispatch({
    type: 'SET_INSTANCE',
    payload: {
      ...payload,
      abi,
      items,
      containers: Object.keys(items),
    },
  });
};

export const resetInstance = async () => {
  const ids = Object.keys(state.instance.abi);
  const items =
    ids.length > 1
      ? {
          A: ids.slice(0, ids.length / 2 + 1),
          B: ids.slice(ids.length / 2 + 1),
        }
      : { A: ids };
  await dispatch({
    type: 'SET_INSTANCE',
    payload: { items, containers: Object.keys(items) },
  });
};

export const emptyInstance = async () => {
  await dispatch({
    type: 'SET_INSTANCE',
    payload: {
      name: '',
      address: '',
      network: '',
      abi: {},
      items: {},
      containers: [],
    },
  });
};
