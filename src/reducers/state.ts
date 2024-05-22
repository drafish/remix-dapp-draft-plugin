export const appInitialState: any = {
  loading: { screen: true },
  instance: {
    name: '',
    address: '',
    network: '',
    abi: {},
    items: {},
    containers: [],
  },
};

export const appReducer = (state = appInitialState, action: any): any => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, ...action.payload },
      };

    case 'SET_INSTANCE':
      return {
        ...state,
        instance: { ...state.instance, ...action.payload },
      };

    case 'EMPTY_INSTANCE':
      return {
        name: '',
        address: '',
        network: '',
        abi: {},
        items: {},
        containers: [],
      };

    default:
      throw new Error();
  }
};
