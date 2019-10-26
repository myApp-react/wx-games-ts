import React from 'react';
import { ActivityIndicator } from 'antd-mobile';

export default () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100px',
      height: '100px',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <ActivityIndicator toast animating size="large"  text="Loading..." />
    </div>
  </div>
);
