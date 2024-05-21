import React from 'react';
import BounceLoader from 'react-spinners/BounceLoader';
import { useAppSelector } from '../../redux/hooks';

const LoadingScreen: React.FC = () => {
  const loading = useAppSelector((state) => state.loading.screen);

  return loading ? (
    <div
      className="w-100 h-100 position-fixed opacity-100 z-3"
      style={{
        top: 0,
        backgroundColor: 'rgba(51, 51, 51, 0.8)',
      }}
    >
      <BounceLoader
        color="#a7b0ae"
        size={100}
        className="position-absolute m-0"
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
    </div>
  ) : null;
};

export default LoadingScreen;
