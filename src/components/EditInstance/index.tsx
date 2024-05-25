import { useContext } from 'react';
import { MultipleContainers } from '../MultipleContainers';
import { AppContext } from '../../contexts';
import EditableText from '../EditableText';

function EditInstance(): JSX.Element {
  const { appState, dispatch } = useContext(AppContext);
  const { abi, items, containers, title, intro } = appState.instance;
  return (
    <div className="col-9 d-inline-block row">
      <div className="mx-4 my-2 p-3 w-75 bg-light">
        <EditableText
          value={title}
          placeholder="Enter a title for this DApp - if needed"
          onSave={(value) => {
            dispatch({ type: 'SET_INSTANCE', payload: { title: value } });
          }}
        />
      </div>
      <div className="mx-4 my-2 p-3 w-75 bg-light">
        <EditableText
          value={intro}
          placeholder="Enter instructions for this DApp - if needed"
          onSave={(value) => {
            dispatch({ type: 'SET_INSTANCE', payload: { intro: value } });
          }}
          textarea
        />
      </div>
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
