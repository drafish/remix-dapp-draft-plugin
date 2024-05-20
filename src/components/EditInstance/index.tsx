import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { MultipleContainers } from '../MultipleContainers';

function EditInstance(): JSX.Element {
  const { abi, items, containers } = useAppSelector((state) => state.instance);
  const dispatch = useAppDispatch();
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
            type: 'instance/save',
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
