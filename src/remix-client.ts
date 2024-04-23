import { PluginClient } from '@remixproject/plugin';
import { createClient } from '@remixproject/plugin-webview';
import { store } from './redux/store';

class RemixClient extends PluginClient {
  constructor() {
    super();
    createClient(this);
  }

  edit({ address, abi, network, name, devdoc, methodIdentifiers }: any): void {
    console.log(
      'edit dapp',
      address,
      abi,
      network,
      name,
      devdoc,
      methodIdentifiers
    );
    store.dispatch({
      type: 'instance/init',
      payload: {
        address,
        abi,
        network,
        name,
        devdoc,
        methodIdentifiers,
      },
    });
  }
}

export default new RemixClient();
