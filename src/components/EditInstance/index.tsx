import { useContext } from 'react';
import { MultipleContainers } from '../MultipleContainers';
import { AppContext } from '../../contexts';

function EditInstance(): JSX.Element {
  const { appState, dispatch } = useContext(AppContext);
  const { abi, items, containers } = appState.instance;
  return (
    <div className="col-9 d-inline-block row">
      <MultipleContainers
        abi={abi}
        items={items}
        containers={containers}
        setItemsAndContainers={(
          newItems: any = items,
          newContainers: any = containers
        ) => {
          dispatch({
            type: 'SET_INSTANCE',
            payload: {
              items: newItems,
              containers: newContainers,
            },
          });
        }}
        handle
        scrollable
        containerStyle={{
          maxHeight: '90vh',
        }}
      />
    </div>
  );
}

export default EditInstance;
