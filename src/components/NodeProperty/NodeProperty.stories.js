import React from 'react';
import { storiesOf } from '@storybook/react';

import NodeProperty from './NodeProperty';


storiesOf('NodeProperty', module)
    .add('NodeProperty', () =>{
      return <NodeProperty />
    }
)
