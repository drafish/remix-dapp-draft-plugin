import React, { useEffect } from 'react';
import CreateInstance from './components/CreateInstance';
import EditInstance from './components/EditInstance';
import DeployPanel from './components/DeployPanel';
import LoadingScreen from './components/LoadingScreen';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import './App.css';

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const abi = useAppSelector((state) => state.instance.abi);

  useEffect(() => {
    dispatch({ type: 'remixide/connect' });
  }, []);
  return (
    <div>
      {Object.keys(abi).length > 0 ? (
        <div className="row m-0 pt-3">
          <EditInstance />
          <DeployPanel />
        </div>
      ) : (
        <div className="row m-0 pt-3">
          <CreateInstance />
        </div>
      )}
      <LoadingScreen />
    </div>
  );
}

export default App;
