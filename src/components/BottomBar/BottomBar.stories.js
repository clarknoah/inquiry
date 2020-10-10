import React from 'react';
import { storiesOf } from '@storybook/react';

import BottomBar from './BottomBar';


storiesOf('BottomBar', module)
    .add('BottomBar', () =>{
      return <BottomBar />
    }
)
